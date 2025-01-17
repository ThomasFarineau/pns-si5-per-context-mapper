import {Service} from "./Service";
import {PotentialRelation} from "./PotentialRelation";

/**
 * Représente un modèle de données
 *
 * @property {Service[]} services - Les services du projet
 * @property {string} name - Le nom du projet associé
 * @property {Entity} entities - Les entités du projet
 * @property {Link[]} links - Les liens entre les services
 */

type Link = {
    up: string; down: string;
}

type Entity = {
    [key: string]: any;
}

export class DataModel {
    services: Service[] = [];
    entities: Entity = {};
    links: Link[] = [];
    potentialRelations: PotentialRelation[] = [];

    constructor(public name: string) {
    }

    /**
     * Ajoute un fichier swagger au projet
     * @param service
     */
    addService(service: Service): void {
        if (!this.containsService(service)) this.services.push(service);
    }

    /**
     * Ajoute une entité au modèle de données
     * @param entity - L'entité à ajouter
     */
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

    /**
     * Trie les services par ordre alphabétique
     */
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

    /**
     * Compare deux services
     * @param a - Le premier service
     * @param b - Le deuxième service
     */
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
        // return a.name.localeCompare(b.name, 'en', {sensitivity: 'base'});
    }

    /**
     * Ajoute un lien entre deux services
     * @param up - Le service upstream
     * @param down - Le service downstream
     */
    addLink(up: Service, down: Service): void {
        this.links.push({
            up: up.name, down: down.name
        });
    }

    /**
     * Supprime un lien entre deux services
     * @param up - Le service upstream
     * @param down - Le service downstream
     */
    removeLink(up: Service, down: Service): void {
        this.links.splice(this.links.indexOf({
            up: up.name, down: down.name
        }), 1);
    }

    /**
     * Récupère un service par sa clé
     * @param key - La clé du service (généralement le lien vers le fichier OpenAPI)
     */
    getServiceByKey(key: string): Service | undefined {
        return this.services.find(service => service.key === key);
    }

    /**
     * Supprime les caractères spéciaux du nom du projet et des noms des services
     */
    alphaNumeric(): void {
        this.alphaNumericName();
        this.alphaNumericServiceNames();
    }

    /**
     * Supprime les caractères spéciaux du nom du projet
     */
    private alphaNumericName(): void {
        this.name = this.keepOnlyAlphaNumeric(this.name);
    }

    /**
     * Supprime les caractères spéciaux des noms des services
     */
    private alphaNumericServiceNames(): void {
        for (let service of this.services) {
            service.name = this.keepOnlyAlphaNumeric(service.name);
        }
    }

    /**
     * Supprime les caractères spéciaux d'une chaîne de caractères
     * @param str - La chaîne de caractères
     */
    private keepOnlyAlphaNumeric(str: string): string {
        return str.replace(/[^a-z0-9]/gi, '');
    }
}