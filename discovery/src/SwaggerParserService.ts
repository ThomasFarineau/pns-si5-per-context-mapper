import * as dotenv from 'dotenv';
import SwaggerParser from "@apidevtools/swagger-parser";

import {Project} from "./Project";
import {DataModel} from "./DataModel";
import {Service} from "./Service";
import {Entity} from './Entities';
import {PotentialRelation} from "./PotentialRelation";
const Diff = require('diff');

dotenv.config();

type KeyedApi = {
    key: string;
    api: any;
}

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
            let apis: KeyedApi[] = [];
            let promises = swaggerFiles.map(async swaggerFile => {
                try {
                    //console.log("Parsing " + swaggerFile + "...");
                    const api = await SwaggerParser.validate(swaggerFile);
                    if (project.dockerComposeFiles.includes(swaggerFile)) {
                        project.removeDockerComposeFile(swaggerFile);
                    }
                    apis.push({
                        key: swaggerFile,
                        api: api
                    });
                } catch (err: any) {
                    console.error(swaggerFile, err.message);
                    project.removeSwaggerFile(swaggerFile);
                }
            });
            Promise.all(promises).then(() => {
                console.log("Building model for " + project.name + "...");
                resolve(this.buildDataModel(apis, project.name));
            }).catch(err => {
                console.error(err);
                reject(err);
            });
        })
    }

    searchPotentialRelationsDiff(dataModel: DataModel) {
        for (let i = 0; i < dataModel.services.length - 1; i++) {
            const service = dataModel.services[i];
            for (let restMethodsKey in service.restMethods) {
                for (const restMethod of service.restMethods[restMethodsKey]) {
                    //console.log(JSON.stringify(restMethod, null, 2));
                    if (restMethod.requestBody) {
                        //console.log(restMethod.requestBody.content["application/json"].schema);
                        for (let j = i + 1; j < dataModel.services.length; j++) {
                            const service2 = dataModel.services[j];
                            if (service.name !== service2.name) {
                                for (let restMethodsKey2 in service2.restMethods) {
                                    for (const restMethod2 of service2.restMethods[restMethodsKey2]) {
                                        if (restMethod2.requestBody) {
                                            //console.log(restMethod2.requestBody, restMethod.requestBody, "\n");
                                            if (restMethod.requestBody.content["application/json"] && restMethod2.requestBody.content["application/json"]) {
                                                const diff = Diff.diffJson(restMethod.requestBody.content["application/json"].schema, restMethod2.requestBody.content["application/json"].schema, {});
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
                                                    console.log("Found potential relation for services " + service.name + " and " + service2.name, equalCount, totalCount);
                                                    dataModel.addPotentialRelation(new PotentialRelation([service.name, service2.name]));
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
            console.log("End of diff for " + service.name);
        }
    }

    /**
     * Fonction construisant notre modèle de données à partir de l'objet parsable issu du fichier OpenAPI
     *
     * @property {string} projectName - Le nom du projet
     * @property {KeyedApi[]} keyedApis - Les objets d'api parsables
     * @returns {DataModel}
     */
    buildDataModel(keyedApis: KeyedApi[], projectName: string): DataModel {
        let dataModel: DataModel = new DataModel(projectName);
        for (let keyedApi of keyedApis) {
            let service = new Service(keyedApi.key, keyedApi.api.info.title);
            let components = service.components;
            for (const path in keyedApi.api.paths) {
                const currentPath = keyedApi.api.paths[path];
                for (const restMethod in currentPath) {
                    let currentRestMethod = currentPath[restMethod];
                    service.addRestMethod(restMethod, currentRestMethod);
                }
            }
            if (keyedApi.api.components !== undefined) {
                for (const schema in keyedApi.api.components.schemas) {
                    const currentSchema = keyedApi.api.components.schemas[schema];
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

        this.searchPotentialRelationsDiff(dataModel);

        console.log(dataModel.potentialRelations);

        return dataModel;
    }
}