import * as dotenv from 'dotenv';
import SwaggerParser from "@apidevtools/swagger-parser";

import {Project} from "./Project";
import {DataModel} from "./DataModel";
import {Service} from "./Service";
import * as path from "path";
import {CMLCreator} from "./CMLCreator";
import * as fs from "fs";
import { Entity } from './Entities';

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
    init(projects: Project[], outputFolder: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            let promises = projects.map(async (project) => {
                await this.parseSwaggerFiles(project, outputFolder)
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
    async parseSwaggerFiles(project: Project, outputFolder: string): Promise<void> {
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
                    console.error(swaggerFile, err.message);
                }
            });
            Promise.all(promises).then(() => {
                console.log("Building model...");
                let dataModel = this.buildDataModel(apis, project.name);
                //console.log(dataModel);
                this.createCMLFile(dataModel, outputFolder).then(() => resolve()).catch(() => reject());
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
            let service = new Service(api.info.title);
            let components = service.components;
            for (const path in api.paths) {
                const currentPath = api.paths[path];
                for (const restMethod in currentPath) {
                    let currentRestMethod = currentPath[restMethod];
                    service.addRestMethod(restMethod, currentRestMethod);
                }
            }
            if (api.components !== undefined) {
                for (const schema in api.components.schemas) {
                    const currentSchema = api.components.schemas[schema];
                    components.addSchemas(schema, currentSchema);
                    console.log("Schema added: " + schema , currentSchema);

                    if (currentSchema.type === "object") {
                        let properties = currentSchema.properties;
                        for (let property in properties) {
                            let currentProperty = properties[property];
                            let entity = new Entity(property, service.name, currentProperty);
                            dataModel.addEntity(entity);
                        }
                    }
                }
            }
            /*for (const key in service.restMethods) {
                for (const value of service.restMethods[key]) {
                    console.log("VALUE", value.parameters);
                    if (value.parameters === undefined)
                        console.log(value)
                }
            }*/
            for (const value of service.restMethods["post"]) {
                console.log("VALUE", value.parameters);
            }
            dataModel.addService(service);
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
    async createCMLFile(dataModel: DataModel, outputFolder: string): Promise<void> {
        return new Promise((resolve, reject) => {
            let cmlCreator: CMLCreator = new CMLCreator(dataModel);
            fs.writeFile(path.join(outputFolder, dataModel.name + ".cml"), cmlCreator.getCMLFileContent(), err => {
                if (err) {
                    console.error(err);
                    reject();
                } else {
                    console.log("File writen successfully");
                    resolve();
                }
            });
        })
    }
}