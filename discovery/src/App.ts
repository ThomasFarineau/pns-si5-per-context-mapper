import {dockerComposeParser, scanner, swaggerParser} from "./util";

import * as dotenv from 'dotenv';
import * as path from "path";

dotenv.config();

/**
 * Fonction point d'entrée de l'application, elle est asynchrone et ne retourne rien
 *
 * @returns {Promise<void>}
 * @async
 * @function main
 * @param {string} url - Dossier a scanner (optionnel)
 * @param skipNaming {boolean} - Si true, ignore la convention de nommage
 * @param outputFolder {string} - Emplacement d'écriture des fichiers CML
 * @name main
 * @example await main()
 */
export const main = async (url: string = "", skipNaming: boolean = false, outputFolder: string = path.resolve("../sandbox/context-mapper-forward/src/main/resources/models")): Promise<void> => new Promise((resolve) => {
    scanner.init(url, skipNaming).then((projects) => {
        swaggerParser.init(projects, outputFolder).then(() => {
            dockerComposeParser.init();
            resolve();
        })
    })
});

/*if (process.env.APP_ENV === 'DEVELOPMENT') main().catch(err => {
    console.error("Erreur lors de l'exécution de la fonction main:", err);
    process.exit(1);
});*/