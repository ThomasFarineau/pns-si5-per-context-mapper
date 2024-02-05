/**
 * Représente un projet
 *
 * @property {string[]} swaggerFiles - Les fichiers swagger du projet
 * @property {string} name - Le nom du projet
 */

export class Project {
    swaggerFiles: string[] = [];
    dockerComposeFiles: string[] = [];

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
}