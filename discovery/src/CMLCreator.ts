import {DataModel} from "./DataModel";

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
            contexts += "}\n\n";
        }
        this.fileContent += contexts;
    }
}