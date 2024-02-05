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

    sortServices(): void {
        this.services.sort(this.compareServices);
    }

    compareServices(a: Service, b: Service): number {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();

        if (nameA < nameB) {
            return -1;
        } else if (nameA > nameB) {
            return 1;
        } else {
            return 0;
        }
    }

    alphaNumeric(): void {
        this.alphaNumericName();
        this.alphaNumericServiceNames();
    }

    alphaNumericName(): void {
        this.name = this.keepOnlyAlphaNumeric(this.name);
    }

    alphaNumericServiceNames(): void {
        for (let service of this.services) {
            service.name = this.keepOnlyAlphaNumeric(service.name);
        }
    }

    keepOnlyAlphaNumeric(str: string): string {
        return str.replace(/[^a-z0-9]/gi, '');
    }
}