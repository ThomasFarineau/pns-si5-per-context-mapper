import * as yaml from 'js-yaml';
import fs from "fs";

export type service = {
    name: string,
    context: string,
    depends_on: string[],
}


export class DockerComposeParser {
    private services: service[] = [];
    private readonly file: string;
    constructor(file: string) {
        this.file = file;
    }

    init(): Promise<service[]> {
        return new Promise((resolve, reject) => {
            console.log("Parsing docker-compose file " + this.file)
            fs.readFile(this.file, 'utf8', (err, data) => {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                const doc = yaml.load(data);
                //console.log(doc)
                // @ts-ignore
                for (const serviceName in doc.services) {
                    // @ts-ignore
                    const service = doc.services[serviceName];
                    if(service.build){
                        this.services.push({
                            name: serviceName,
                            context: this.removeContextPath(service.build.context ?? ""),
                            depends_on: service.depends_on
                        });

                    } else {
                        this.services.push({
                            name: serviceName,
                            context: "",
                            depends_on: service.depends_on
                        });
                    }
                }
                resolve(this.services);
            });
        });
    }


    private removeContextPath(context: string): string {
        let t = context.split("/");
        return t[t.length - 1];
    }
}