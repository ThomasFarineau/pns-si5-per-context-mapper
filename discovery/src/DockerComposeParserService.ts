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
    init(projects: Project[], dataModels: DataModel[]): Promise<DataModel[]> {
        console.log('classe de parsing du docker-compose');
        console.log(projects)
        console.log(dataModels)
        return new Promise((resolve, reject) => {
            resolve(dataModels);
        })
    }
}