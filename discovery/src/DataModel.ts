import {Service} from "./Service";
import {PotentialRelation} from "./PotentialRelation";

/**
 * Représente un modèle de données
 *
 * @property {Service[]} services - Les services du projet
 * @property {string} name - Le nom du projet associé
 */

export class DataModel {
    services: Service[] = [];
    entities: { [key: string]: any } = {};
    potentialRelations: PotentialRelation[] = [];

    constructor(public name: string) {}

    /**
     * Ajoute un fichier swagger au projet
     * @param service
     */
    addService(service: Service): void {
        if (!this.containsService(service))
            this.services.push(service);
    }

    addEntity(entity: any): void {
        if (this.entities[entity.service] === undefined) {
            this.entities[entity.service] = [];
        }
        this.entities[entity.service].push(entity);
    }

    addPotentialRelation(relation: PotentialRelation): void {
        if (!this.containsRelation(relation))
            this.potentialRelations.push(relation);
    }

    sortServices(): void {
        this.services.sort(this.compareServices);
    }

    containsService(service: Service): boolean {
        return this.services.some((element) => element.name === service.name);
    }

    arraysEquals(a: any[], b: any[]) {
        return JSON.stringify(a) === JSON.stringify(b);
    }

    containsRelation(relation: PotentialRelation): boolean {
        return !!this.potentialRelations.find(e => this.arraysEquals(e.services, relation.services));
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