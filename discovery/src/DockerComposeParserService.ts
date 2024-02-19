import {DataModel} from "./DataModel";
import {Project} from "./Project";

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
    init(projects: Project[]): Promise<DataModel[]> {
        console.log('classe de parsing du docker-compose');
        //console.log(JSON.stringify(projects, null, 2));
        return new Promise((resolve, reject) => {
            let dataModels: DataModel[] = [];
            projects.forEach(project => {
                dataModels.push(project.dataModel!);
            });
            resolve(dataModels);
        })
    }
}