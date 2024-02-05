import * as dotenv from 'dotenv';
import SwaggerParser from "@apidevtools/swagger-parser";

import {Project} from "./Project";
import {DataModel} from "./DataModel";
import {Service} from "./Service";

dotenv.config();

/**
 * Classe de parsing des swaggers
 *
 * @class SwaggerParserService
 * @name SwaggerParserService
 *
 * @author Thomas Farineau
 * @date 05/02/2024
 *
 * @see https://apidevtools.org/swagger-parser/docs/swagger-parser.html
 */
export class SwaggerParserService {
    /**
     * Fonction d'initialisation de la classe
     *
     * @function init
     * @name init
     * @example SwaggerParserService.init()
     * @returns {void}
     *
     */
    init(projects: Project[]): void {
        projects.forEach(project => this.parseSwaggerFiles(project))
    }

    /**
     * Fonction transformant les fichiers OpenAPI en objets
     *
     * @returns {void}
     */
    parseSwaggerFiles(project: Project): void {
        let swaggerFiles = project.swaggerFiles;
        let apis: any[] = [];
        let promises = swaggerFiles.map(async swaggerFile => {
            try {
                let api = await SwaggerParser.validate(swaggerFile);
                console.log("API name: %s, Version: %s", api.info.title, api.info.version);
                apis.push(api);
            } catch (err) {
                console.error(err);
            }
        })
        Promise.all(promises).then(() => {
            this.buildDataModel(apis);
        })
    }

    buildDataModel(apis: any[]) {
        console.log(apis.length);
        let dataModel: DataModel = new DataModel();
        for (let api of apis) {
            dataModel.addService(new Service(api.info.title));
        }
        console.log(dataModel.services);
    }
}