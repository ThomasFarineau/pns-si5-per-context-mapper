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
    dataModel: DataModel | null = null;

    constructor(public name: string) {
    }

    /**
     * Ajoute un fichier swagger au projet
     * @param file
     */
    addSwaggerFile(file: string): void {
        this.swaggerFiles.push(file);
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
}