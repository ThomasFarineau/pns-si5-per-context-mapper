import {dockerComposeParser, scanner, swaggerParser} from "./util";

import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Fonction point d'entrée de l'application, elle est asynchrone et ne retourne rien
 *
 * @returns {Promise<void>}
 * @async
 * @function main
 * @name main
 * @example await main()
 */
export const main = async (): Promise<void> => {
    scanner.init().then((projects) => {
        swaggerParser.init(projects);
        dockerComposeParser.init();
    })
};

if (process.env.APP_ENV === 'DEVELOPMENT') {
    main().catch(err => {
        console.error("Erreur lors de l'exécution de la fonction main:", err);
        process.exit(1);
    });
}