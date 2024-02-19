/*
 * Les Entités d'un Service
 */

export class Entity {
    name: string;
    properties: { [key: string]: any };
    service: string;

    constructor(name: string, service: string, properties: { [key: string]: any }) {
        this.name = name;
        this.service = service;
        this.properties = properties;
    }
}

