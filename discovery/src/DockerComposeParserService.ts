import {DataModel} from "./DataModel";
import {Project} from "./Project";
import {DockerComposeParser} from "./DockerComposeParser";

/**
 * Classe de parsing du docker-compose
 *
 * @class DockerComposeParserService
 * @name DockerComposeParserService
 *
 * @author Thomas Farineau
 * @date 05/02/2024
 */
export class DockerComposeParserService {
    /**
     * Fonction d'initialisation de la classe
     *
     * @function init
     * @name init
     * @example DockerComposeParserService.init()
     * @returns {Promise<DataModel[]>}
     */
    async init(projects: Project[]): Promise<DataModel[]> {
        return new Promise((resolve, reject) => {
            // Créer un tableau pour stocker les promesses de parseDockerComposeFiles
            const parsePromises: Promise<any>[] = [];
            projects.forEach(project => {
                if (project.dockerComposeFiles.length > 0) {
                    // Stocker chaque promesse retournée par parseDockerComposeFiles
                    const parsePromise = new Promise((resolve, reject) => {
                        console.log("Parsing docker-compose files for project " + project.name + "...");

                        // Créer un tableau de promesses à partir des initialisations de DockerComposeParser pour chaque fichier
                        const initPromises = project.dockerComposeFiles.map(file => new DockerComposeParser(file).init());

                        // Utiliser Promise.all pour attendre que toutes les promesses soient résolues
                        const servicesArrays = Promise.all(initPromises);

                        // À ce stade, toutes les promesses sont résolues, et `servicesArrays` contient les résultats de chaque `init()`
                        servicesArrays.then(servicesArrays => {
                            console.log(servicesArrays)
                            resolve(null);
                        });
                    });
                    parsePromises.push(parsePromise);
                }
            });
            Promise.all(parsePromises).then(() => {
                resolve(projects.map(project => project.dataModel!).filter(dm => dm !== undefined));
            })
        })
    }

}