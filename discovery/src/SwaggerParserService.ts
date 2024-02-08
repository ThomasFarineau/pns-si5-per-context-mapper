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
     *
     */
    init(projects: Project[]): Promise<boolean> {
        return new Promise((resolve, reject) => {
            let promises = projects.map(async (project) => {
                await this.parseSwaggerFiles(project)
            })
            Promise.all(promises).then(() => resolve(true))
        })
    }

    /**
     * Fonction transformant les fichiers OpenAPI en objets parsables
     *
     * @property {Project} project - Le projet utilisé
     * @returns {Promise<void>}
     */
    async parseSwaggerFiles(project: Project): Promise<void> {
        return new Promise((resolve, reject) => {
            let swaggerFiles = project.swaggerFiles;
            let apis: any[] = [];
            let promises = swaggerFiles.map(async swaggerFile => {
                try {
                    console.log("Parsing " + swaggerFile + "...");
                    const api = await SwaggerParser.validate(swaggerFile);
                    console.log(api.info.title + " parsed");
                    apis.push(api);
                } catch (err: any) {
                    console.error(err.message);
                }
            });
            Promise.all(promises).then(() => {
                let dataModel = this.buildDataModel(apis, project.name);
                console.log(dataModel);
                this.createCMLFile(dataModel);
                resolve();
            }).catch(err => {
                console.error(err);
                reject(err);
            });
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