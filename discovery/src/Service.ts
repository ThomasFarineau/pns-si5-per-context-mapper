/**
 * Représente un Service
 *
 * @property {string} name - Le nom du service
 */

export class Service {
    restMethods: { [key: string]: any[] };

    constructor(public name: string) {
        this.restMethods = {
            "post": [],
            "get": []
        };
    }

    addRestMethod(key: string, value: object): void {
        if (key === "post" || key === "get")
            this.restMethods[key].push(value);
    }

}