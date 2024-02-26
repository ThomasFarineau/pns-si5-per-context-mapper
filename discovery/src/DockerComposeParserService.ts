import {DataModel} from "./DataModel";
import {Project} from "./Project";
import {DockerComposeParser} from "./DockerComposeParser";
import fs from "fs";
import yaml from "js-yaml";
import path from "path";

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
    async init(projects: Project[]): Promise<Project[]> {
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

                        // À ce stade, toutes les promesses sont résolues, et `servicesArrays` contient les résultats de chaque `init()`
                        Promise.all(initPromises).then(servicesArrays => {
                            servicesArrays.forEach(services => services.forEach(service => {
                                if (service.depends_on !== undefined) {
                                    service.depends_on.forEach(dep => {
                                        let serviceDep = services.find(s => s.name === dep);
                                        if (serviceDep !== undefined && serviceDep.context !== "") {
                                            project.addLink(project.getByContext(service.context), project.getByContext(serviceDep.context))
                                        }
                                    })
                                }
                            }))
                            // -------- YAML --------
                            let aggregatedArray = {};
                            if (project.dataModel)
                                aggregatedArray = this.aggregateArray(project.dataModel.links);
                            console.log("Writing dependencies file for " + project.name);
                            fs.writeFile(path.join(project.context, 'dependencies.yaml'), yaml.dump(aggregatedArray), err => {
                                if (err) {
                                    reject(null);
                                }
                                else {
                                    resolve(null);
                                }
                            });
                        });
                    });
                    parsePromises.push(parsePromise);
                }
            });
            Promise.all(parsePromises).then(() => {
                resolve(projects);
            })
        })
    }

    aggregateArray(arr: any[]): { [key: string]: string[] } {
        const aggregated: { [key: string]: string[] } = {};

        arr.forEach(obj => {
            const { up, down } = obj;
            if (!aggregated[up]) {
                aggregated[up] = [down];
            } else {
                aggregated[up].push(down);
            }
        });

        return aggregated;
    }

}