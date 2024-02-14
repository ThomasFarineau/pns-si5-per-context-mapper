import {DataModel} from "./DataModel";
import { Service } from "./Service";

/**
 * Classe de création du fichier CML
 *
 * @class CMLCreator
 * @name CMLCreator
 * @property {DataModel} dataModel - Le modèle de données
 */

export class CMLCreator {
    fileContent: string = "";

    constructor(public dataModel: DataModel) {}

    /**
     * Retourne le contenu du fichier CML
     *
     * @returns {string}
     */
    getCMLFileContent(): string {
        
        this.appendContextMap();

        this.appendDomains();

        this.appendContexts();

        return this.fileContent;
    }

    appendContextMap(): void {
        let contextMap: string = "";
        contextMap += "ContextMap " + this.dataModel.name + "ContextMap" + " {\n\n";
        for (let service of this.dataModel.services) {
            contextMap += "\tcontains " + service.name + "Context" + " \n\n";
        }
        contextMap += "}\n";
        this.fileContent += contextMap;
    }

    appendDomains(): void {
        let domains: string = "";
        domains += "\nDomain " + this.dataModel.name + "Domain" + " {\n\n";
        for (let service of this.dataModel.services) {
            domains += "\tSubDomain " + service.name + "Domain" + " {\n";
            domains += "\t}\n\n";
        }
        domains += "}\n\n";
        this.fileContent += domains;
    }

    appendContexts(): void {
        let contexts: string = "";
        for (let service of this.dataModel.services) {
            let alphaNumeric = service.name;
            contexts += "BoundedContext " + alphaNumeric + "Context implements " + alphaNumeric + "Domain " + " {\n";
            contexts += this.appendAggregates(service)
            contexts += "}\n\n";
        }
        this.fileContent += contexts;
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