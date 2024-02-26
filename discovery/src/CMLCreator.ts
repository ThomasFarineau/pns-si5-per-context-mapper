import {DataModel} from "./DataModel";
import fs from "fs";
import path from "path";
import { Service } from "./Service";
import yaml from 'js-yaml';
import {Project} from "./Project";

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
    async createCMLFile(projects: Project[], outputFolder: string): Promise<void> {
        return new Promise((resolve, reject) => {
            let promises = projects.map((project) => {
                return new Promise<void>((resolveFile, rejectFile) => {
                    let dataModel = project.dataModel;
                    if (dataModel) {
                        fs.writeFile(path.join(outputFolder, dataModel.name + ".cml"), this.getCMLFileContent(project, false), err => {
                            if (err) {
                                console.error(err);
                                rejectFile();
                            } else {
                                console.log("CML file written successfully");
                                if (dataModel) {
                                    fs.writeFile(path.join(outputFolder, dataModel.name + "-potential.cml"), this.getCMLFileContent(project, true), err => {
                                        if (err) {
                                            console.error(err);
                                            rejectFile();
                                        } else {
                                            console.log("CML file with potential relations written successfully");
                                            resolveFile();
                                        }
                                    });
                                }
                            }
                        });
                    }
                    else rejectFile();
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
    getCMLFileContent(project: Project, addPotentialRelations: boolean): string {
        const dataModel = project.dataModel;
        let fileContent = "";

        if (dataModel) {
            fileContent = this.appendContextMap(fileContent, dataModel, addPotentialRelations, project.context);

            fileContent = this.appendDomains(fileContent, dataModel);

            fileContent = this.appendContexts(fileContent, dataModel);
        }

        return fileContent;
    }

    /**
     * Retourne le nom du contexte
     * @param name - Le nom du contexte
     * @private
     */
    private contextName(name: string): string {
        return name + "Context";
    }

    appendContextMap(fileContent: string, dataModel: DataModel, addPotentialRelations: boolean, dependenciesPath: string): string {
        let contextMap: string = "";
        contextMap += "ContextMap " + dataModel.name + "ContextMap" + " {\n\n";
        for (let service of dataModel.services) {
            contextMap += "\tcontains " + this.contextName(service.name) + " \n\n";
        }

        /*dataModel.links.forEach(link => {
            contextMap += "\t" + this.contextName(link.up) + " [U]->[D] " + this.contextName(link.down) + "\n";
        })*/

        if (fs.existsSync(path.join(dependenciesPath, "dependencies.yaml"))) {
            const dependencies = fs.readFileSync(path.join(dependenciesPath, "dependencies.yaml"), 'utf-8');

            const dependYaml: any = yaml.load(dependencies);

            for (const key in dependYaml) {
                if (this.isIterable(dependYaml[key])) {
                    for (const value of dependYaml[key]) {
                        //console.log(key, value);
                        contextMap += "\t" + this.contextName(key) + " [U]->[D] " + this.contextName(value) + "\n";
                    }
                }
            }
        }

        if (addPotentialRelations) {
            dataModel.potentialRelations.forEach(relation => {
                contextMap += "\t" + this.contextName(relation.services[0]) + " <-> " + this.contextName(relation.services[1]) + "\n";
            })
        }
        contextMap += "}\n";
        fileContent += contextMap;
        return fileContent;
    }

    isIterable(input: any) {
        if (input === null || input === undefined) {
            return false
        }

        return typeof input[Symbol.iterator] === 'function'
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