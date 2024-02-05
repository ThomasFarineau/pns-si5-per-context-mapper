import {Service} from "./Service";

/**
 * Représente un modèle de données
 *
 * @property {Service[]} services - Les services du projet
 */

export class DataModel {
    services: Service[] = [];

    constructor() {}

    /**
     * Ajoute un fichier swagger au projet
     * @param service
     */
    addService(service: Service): void {
        this.services.push(service);
    }
}