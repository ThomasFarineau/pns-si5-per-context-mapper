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
        contextMap += "ContextMap " + this.keepOnlyAlphaNumeric(this.dataModel.name) + "ContextMap" + " {\n\n";
        for (let service of this.dataModel.services) {
            contextMap += "\tcontains " + this.keepOnlyAlphaNumeric(service.name) + "Context" + " \n\n";
        }
        contextMap += "}\n";
        this.fileContent += contextMap;
    }

    appendDomains(): void {
        let domains: string = "";
        domains += "\nDomain " + this.keepOnlyAlphaNumeric(this.dataModel.name) + "Domain" + " {\n\n";
        for (let service of this.dataModel.services) {
            domains += "\tSubDomain " + this.keepOnlyAlphaNumeric(service.name) + "Domain" + " {\n";
            domains += "\t}\n\n";
        }
        domains += "}\n\n";
        this.fileContent += domains;
    }

    appendContexts(): void {
        let contexts: string = "";
        for (let service of this.dataModel.services) {
            let alphaNumeric = this.keepOnlyAlphaNumeric(service.name);
            contexts += "BoundedContext " + alphaNumeric + "Context implements " + alphaNumeric + "Domain " + " {\n";
            contexts += "}\n\n";
        }
        this.fileContent += contexts;
    }

    keepOnlyAlphaNumeric(str: string): string {
        return str.replace(/[^a-z0-9]/gi, '');
    }
}