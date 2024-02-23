import { Component } from "./Component";

/**
 * Représente un Service
 *
 * @property {string} name - Le nom du service
 */

export class Service {
    key: string;
    restMethods: { [key: string]: any[] };
    components: Component;

    constructor(key: string, public name: string) {
        this.key = key;
        this.restMethods = {
            "post": [],
            "get": []
        };
        this.components = new Component();
    }

    addRestMethod(key: string, value: object): void {
        if (key === "post" || key === "get")
            this.restMethods[key].push(value);
    }

    setComponents(components: Component): void {
        this.components = components;
    }
}