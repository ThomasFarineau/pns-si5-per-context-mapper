import {DataModel} from "./DataModel";
import fs from "fs";
import path from "path";
import { Service } from "./Service";

/**
 * Classe de création du fichier CML
 *
 * @class CMLCreator
 * @name CMLCreator
 * @property {DataModel} dataModel - Le modèle de données
 */

export class CMLCreator {

    /**
     * Fonction créant le fichier CML à partir du modèle de données
     *
     * @property {DataModel} dataModel - Le modèle de données à transformer en fichier CML
     * @returns {void}
     */
    async createCMLFile(dataModels: DataModel[], outputFolder: string): Promise<void> {
        return new Promise((resolve, reject) => {
            let promises = dataModels.map((dataModel) => {
                return new Promise<void>((resolveFile, rejectFile) => {
                    fs.writeFile(path.join(outputFolder, dataModel.name + ".cml"), this.getCMLFileContent(dataModel), err => {
                        if (err) {
                            console.error(err);
                            rejectFile();
                        } else {
                            console.log("File written successfully");
                            resolveFile();
                        }
                    });
                })
            });
            Promise.all(promises).then(() => {
                resolve();
            }).catch(err => {
                console.error("Erreur lors de l'initialisation des projets: ", err);
                reject(err);
            });
        })
    }

    /**
     * Retourne le contenu du fichier CML
     *
     * @returns {string}
     */
    getCMLFileContent(dataModel: DataModel): string {
        let fileContent = "";

        fileContent = this.appendContextMap(fileContent, dataModel);

        fileContent = this.appendDomains(fileContent, dataModel);

        fileContent = this.appendContexts(fileContent, dataModel);

        return fileContent;
    }

    appendContextMap(fileContent: string, dataModel: DataModel): string {
        let contextMap: string = "";
        contextMap += "ContextMap " + dataModel.name + "ContextMap" + " {\n\n";
        for (let service of dataModel.services) {
            contextMap += "\tcontains " + service.name + "Context" + " \n\n";
        }
        contextMap += "}\n";
        fileContent += contextMap;
        return fileContent;
    }

    appendDomains(fileContent: string, dataModel: DataModel): string {
        let domains: string = "";
        domains += "\nDomain " + dataModel.name + "Domain" + " {\n\n";
        for (let service of dataModel.services) {
            domains += "\tSubDomain " + service.name + "Domain" + " {\n";
            domains += "\t}\n\n";
        }
        domains += "}\n\n";
        fileContent += domains;
        return fileContent;
    }

    appendContexts(fileContent: string, dataModel: DataModel): string {
        let contexts: string = "";
        for (let service of dataModel.services) {
            let alphaNumeric = service.name;
            contexts += "BoundedContext " + alphaNumeric + "Context implements " + alphaNumeric + "Domain " + " {\n";
            /*contexts += this.appendAggregates(service)*/
            contexts += "}\n\n";
        }
        fileContent += contexts;
        return fileContent;
    }

    appendAggregates(service : Service): String {
        let contexts: string = "";
        contexts += "\tAggregate {\n";
        for (let key in service.components.schemas) {
            let schemaActuel = service.components.schemas[key];
            
            contexts += "\t\tEntity " + key + "Entity {\n";
            if (schemaActuel.properties !== undefined){
                for (let property in schemaActuel.properties) {
                    if (schemaActuel.properties[property].type === "array"){
                        contexts += "\t\t\t" + property + " " + schemaActuel.properties[property].items.type + "[]\n";
                    } 
                    else {
                        contexts += "\t\t\t" + property + " " + schemaActuel.properties[property].type + "\n";
                    }
                }
            }
            contexts += "\t\t}\n";    
        }
        contexts += "\t}\n";
        return contexts;
    }
}