import * as dotenv from 'dotenv';
import SwaggerParser from "@apidevtools/swagger-parser";

import {Project} from "./Project";
import {DataModel} from "./DataModel";
import {Service} from "./Service";
import { Entity } from './Entities';
const Diff = require('diff');

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
     * Fonction d'initialisation de la classe qui traite les fichiers Swagger de chaque projet et construit les modèles de données correspondants.
     *
     * @example SwaggerParserService.init(projects, outputFolder)
     * @param projects Les projets à traiter
     * @returns {Promise<Project[]>} Une promesse qui résout avec la liste des modèles de données générés
     */
    init(projects: Project[]): Promise<Project[]> {
        return new Promise((resolve, reject) => {
            let promises = projects.map(project => this.parseSwaggerFiles(project));
            Promise.all(promises).then(dataModels => {
                dataModels.forEach(dataModel => {
                    projects.forEach(project => {
                        if (project.name === dataModel.name) {
                            project.setDataModel(dataModel);
                        }
                    })
                })
                resolve(projects);
            }).catch(err => {
                console.error("Erreur lors de l'initialisation des projets: ", err);
                reject(err);
            });
        });
    }


    /**
     * Fonction transformant les fichiers OpenAPI en objets
     *
     * @property {Project} project - Le projet utilisé
     * @returns {Promise<DataModel>}
     */
    async parseSwaggerFiles(project: Project): Promise<DataModel> {
        return new Promise((resolve, reject) => {
            let swaggerFiles = project.swaggerFiles;
            let apis: any[] = [];
            let promises = swaggerFiles.map(async swaggerFile => {
                try {
                    //console.log("Parsing " + swaggerFile + "...");
                    const api = await SwaggerParser.validate(swaggerFile);
                    if (project.dockerComposeFiles.includes(swaggerFile)) {
                        project.dockerComposeFiles.splice(project.dockerComposeFiles.indexOf(swaggerFile), 1);
                    }
                    apis.push(api);
                } catch (err: any) {
                    console.error(swaggerFile, err.message);
                    project.swaggerFiles.splice(project.swaggerFiles.indexOf(swaggerFile), 1);
                }
            });
            Promise.all(promises).then(() => {
                console.log("Building model for " + project.name + "...");
                let dataModel = this.buildDataModel(apis, project.name);
                resolve(dataModel);
                //this.createCMLFile(dataModel, outputFolder).then(() => resolve()).catch(() => reject());
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
                    //console.log("Schema added: " + schema , currentSchema);

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
            /*for (const value of service.restMethods["post"]) {
                console.log("VALUE", value.parameters);
            }*/
            dataModel.addService(service);
        }
        dataModel.alphaNumeric();
        dataModel.sortServices();

        for (let service of dataModel.services) {
            for (let restMethodsKey in service.restMethods) {
                for (const restMethod of service.restMethods[restMethodsKey]) {
                    //console.log(JSON.stringify(restMethod, null, 2));
                    if (restMethod.requestBody) {
                        //console.log(restMethod.requestBody.content["application/json"].schema);
                        for (let service2 of dataModel.services) {
                            if (service.name !== service2.name) {
                                for (let restMethodsKey2 in service2.restMethods) {
                                    for (const restMethod2 of service2.restMethods[restMethodsKey2]) {
                                        if (restMethod2.requestBody) {
                                            //console.log(restMethod2.requestBody, restMethod.requestBody, "\n");
                                            if (restMethod.requestBody.content["application/json"] && restMethod2.requestBody.content["application/json"]) {
                                                const diff = Diff.diffJson(restMethod.requestBody.content["application/json"].schema, restMethod2.requestBody.content["application/json"].schema, {});
                                                console.log("diff terminée :)");
                                                let totalCount = 0;
                                                let equalCount = 0;
                                                diff.forEach((part: any) => {
                                                    //console.log(part, "\n");
                                                    totalCount += part.count;
                                                    if (!part.added && !part.removed) {
                                                        equalCount += part.count;
                                                    }
                                                })
                                                if (equalCount / totalCount >= 0.8) {
                                                    console.log("Service " + service.name + " to service " + service2.name, equalCount, totalCount);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        return dataModel;
    }
}