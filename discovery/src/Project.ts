/**
 * Représente un projet
 *
 * @property {string[]} swaggerFiles - Les fichiers swagger du projet
 * @property {string} name - Le nom du projet
 */
import {DataModel} from "./DataModel";
import path from "path";

/**
 * Représente un projet
 *
 * @property {string[]} swaggerFiles - Les fichiers swagger du projet
 * @property {string[]} dockerComposeFiles - Les fichiers docker-compose du projet
 *
 * @property {string} name - Le nom du projet
 * @property {DataModel} dataModel - Le modèle de données du projet
 * @property {Object} contexts - Les contextes des fichiers swagger
 */
export class Project {
    swaggerFiles: string[] = [];
    dockerComposeFiles: string[] = [];
    contexts: { [key: string]: string } = {};
    dataModel: DataModel | null = null;
    context: string = "";

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

    /**
     * Définit le modèle de données du projet
     * @param dataModel - Le modèle de données à définir
     */
    setDataModel(dataModel: DataModel) {
        this.dataModel = dataModel;
    }

    /**
     * Convertit le nom du projet en alphanumérique
     */
    alphaNumericName(): void {
        this.name = this.keepOnlyAlphaNumeric(this.name);
    }

    /**
     * Supprime tous les caractères non alphanumériques d'une chaîne
     * @param str - La chaîne à nettoyer
     */
    private keepOnlyAlphaNumeric(str: string): string {
        return str.replace(/[^a-z0-9]/gi, '');
    }

    /**
     * Supprime un fichier swagger du projet
     * @param file - Le fichier à supprimer
     */
    removeSwaggerFile(file: string) {
        this.swaggerFiles.splice(this.swaggerFiles.indexOf(file), 1);
        this.removeContext(file);
    }

    /**
     * Ajoute un contexte à un fichier
     * @param file - Le fichier auquel on veut ajouter un contexte (la clé)
     * @param context - Le contexte à ajouter
     */
    private addContext(file: string, context: string) {
        if (context !== "") {
            this.contexts[file] = context;
        }
    }

    /**
     * Supprime un contexte
     * @param file - Le fichier dont on veut supprimer le contexte
     */
    private removeContext(file: string) {
        delete this.contexts[file];
    }

    /**
     * Supprime un fichier docker-compose du projet
     * @param file - Le fichier à supprimer
     */
    removeDockerComposeFile(file: string) {
        this.dockerComposeFiles.splice(this.dockerComposeFiles.indexOf(file), 1);
    }

    /**
     * Récupère la clé d'un service par son contexte
     * @param context - Le contexte du service
     */
    getByContext(context: string): string {
        return Object.keys(this.contexts).filter(key => this.contexts[key] === context)[0];
    }

    /**
     * Ajoute un lien entre deux services
     * @param upKey - La clé du service upstream
     * @param downKey - La clé du service downstream
     */
    addLink(upKey: string, downKey: string) {
        if(this.dataModel === null) {
            throw new Error("DataModel is not initialized");
        }
        let service = this.dataModel.getServiceByKey(upKey);
        let serviceDep = this.dataModel.getServiceByKey(downKey);
        console.log("Adding link between " + service?.name + " and " + serviceDep?.name)
        this.dataModel.addLink(service!, serviceDep!);
    }

    setContext(folder: string) {
        this.context = path.join("projects", folder);
        console.log(this.context);
    }
}