import {Service} from "./Service";

/**
 * Représente un modèle de données
 *
 * @property {Service[]} services - Les services du projet
 * @property {string} name - Le nom du projet associé
 */

export class DataModel {
    services: Service[] = [];

    constructor(public name: string) {}

    /**
     * Ajoute un fichier swagger au projet
     * @param service
     */
    addService(service: Service): void {
        this.services.push(service);
    }
}