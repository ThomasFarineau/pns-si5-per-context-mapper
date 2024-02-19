/**
 * Représente un projet
 *
 * @property {string[]} swaggerFiles - Les fichiers swagger du projet
 * @property {string} name - Le nom du projet
 */
import {DataModel} from "./DataModel";

export class Project {
    swaggerFiles: string[] = [];
    dockerComposeFiles: string[] = [];
    contexts: { [key: string]: string } = {};
    dataModel: DataModel | null = null;

    constructor(public name: string) {
    }

    /**
     * Ajoute un fichier swagger au projet
     * @param file
     * @param context - Le contexte du fichier (optionnel, utilisé si le projet utilise un docker-compose)
     */
    addSwaggerFile(file: string, context: string = ""): void {
        this.swaggerFiles.push(file);
        this.addContext(file, context);
    }

    /**
     * Ajoute un fichier docker-compose au projet
     *
     * @param file
     */
    addDockerComposeFile(file: string): void {
        this.dockerComposeFiles.push(file);
    }

    setDataModel(dataModel: DataModel) {
        this.dataModel = dataModel;
    }

    alphaNumericName(): void {
        this.name = this.keepOnlyAlphaNumeric(this.name);
    }

    keepOnlyAlphaNumeric(str: string): string {
        return str.replace(/[^a-z0-9]/gi, '');
    }

    removeSwaggerFile(swaggerFile: string) {
        this.swaggerFiles.splice(this.swaggerFiles.indexOf(swaggerFile), 1);
        this.removeContext(swaggerFile);
    }

    private addContext(file: string, context: string) {
        if (context !== "") {
            this.contexts[file] = context;
        }
    }

    private removeContext(file: string) {
        delete this.contexts[file];
    }

    removeDockerComposeFile(swaggerFile: string) {
        this.dockerComposeFiles.splice(this.dockerComposeFiles.indexOf(swaggerFile), 1);
    }
}