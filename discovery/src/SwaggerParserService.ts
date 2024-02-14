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
     * Fonction d'initialisation de la classe qui traite les fichiers Swagger de chaque projet et construit les modèles de données correspondants.
     *
     * @example SwaggerParserService.init(projects, outputFolder)
     * @param projects Les projets à traiter
     * @param outputFolder Le dossier où les fichiers générés doivent être enregistrés
     * @returns {Promise<DataModel[]>} Une promesse qui résout avec la liste des modèles de données générés
     */
    init(projects: Project[], outputFolder: string): Promise<DataModel[]> {
        return new Promise((resolve, reject) => {
            let promises = projects.map(project => this.parseSwaggerFiles(project, outputFolder));
            Promise.all(promises).then(dataModels => {
                resolve(dataModels);
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
    async parseSwaggerFiles(project: Project, outputFolder: string): Promise<DataModel> {
        return new Promise((resolve, reject) => {
            let swaggerFiles = project.swaggerFiles;
            let apis: any[] = [];
            let promises = swaggerFiles.map(async swaggerFile => {
                try {
                    //console.log("Parsing " + swaggerFile + "...");
                    const api = await SwaggerParser.validate(swaggerFile);
                    //console.log(api.info.title + " parsed");
                    apis.push(api);
                } catch (err: any) {
                    console.error(swaggerFile, err.message);
                }
            });
            Promise.all(promises).then(() => {
                console.log("Building model...");
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
            for (const path in api.paths) {
                const currentPath = api.paths[path];
                for (const restMethod in currentPath) {
                    let currentRestMethod = currentPath[restMethod];
                    service.addRestMethod(restMethod, currentRestMethod);
                }
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