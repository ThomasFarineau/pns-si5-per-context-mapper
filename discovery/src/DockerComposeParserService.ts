import {DataModel} from "./DataModel";

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
     * @returns {void}
     */
    init(dataModels: DataModel[]): void {
        console.log(dataModels)
        console.log('classe de parsing du docker-compose');
    }
}