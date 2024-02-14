/*
 * Les Composants d'un Service
 */

export class Component {
    schemas: { [key: string]: any };

    constructor(){
        this.schemas = {};
    }

    addSchemas(key: string, value: object): void {
        if (this.schemas[key] === undefined)
            this.schemas[key] = [];
        this.schemas[key] = value;
    }
}

