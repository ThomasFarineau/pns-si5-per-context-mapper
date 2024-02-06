import * as dotenv from 'dotenv';
import SwaggerParser from "@apidevtools/swagger-parser";

import {Project} from "./Project";
import {DataModel} from "./DataModel";
import {Service} from "./Service";
import * as path from "path";
import {CMLCreator} from "./CMLCreator";
import * as fs from "fs";

dotenv.config();

/**
 * Classe de parsing des swaggers
 *
 * @class SwaggerParserService
 * @name SwaggerParserService
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
     * Fonction transformant les fichiers OpenAPI en objets parsables
     *
     * @property {Project} project - Le projet utilisé
     * @returns {void}
     */
    parseSwaggerFiles(project: Project): void {
        let swaggerFiles = project.swaggerFiles;
        let apis: any[] = [];
        let promises = swaggerFiles.map(async swaggerFile => {
            try {
                let api = await SwaggerParser.validate(swaggerFile);
                apis.push(api);
            } catch (err) {
                console.error(err);
            }
        })
        Promise.all(promises).then(() => {
            let dataModel = this.buildDataModel(apis, project.name);
            console.log(dataModel);
            this.createCMLFile(dataModel);
        })
    }

    /**
     * Fonction construisant notre modèle de données à partir de l'objet parsable issu du fichier OpenAPI
     *
     * @property {string} projectName - Le nom du projet
     * @property {any[]} apis - Les objets d'api parsables
     * @returns {DataModel}
     */
    buildDataModel(apis: any[], projectName: string): DataModel {
        let dataModel: DataModel = new DataModel(projectName);
        for (let api of apis) {
            dataModel.addService(new Service(api.info.title));
        }
        dataModel.alphaNumeric();
        dataModel.sortServices();
        return dataModel;
    }

    /**
     * Fonction créant le fichier CML à partir du modèle de données
     *
     * @property {DataModel} dataModel - Le modèle de données à transformer en fichier CML
     * @returns {void}
     */
    createCMLFile(dataModel: DataModel): void {
        let cmlCreator: CMLCreator = new CMLCreator(dataModel);
        fs.writeFile(path.join(__dirname, '..', '..', 'sandbox', 'context-mapper-forward', 'src', 'main', 'resources', 'models', dataModel.name + ".cml"), cmlCreator.getCMLFileContent(), err => {
            if (err) {
                console.error(err);
            } else {
                console.log("File writen successfully");
            }
        });
    }
}