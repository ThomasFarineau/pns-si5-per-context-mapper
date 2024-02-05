import * as dotenv from 'dotenv';
import SwaggerParserService from "./SwaggerParser.service";
import DockerComposeParserService from "./DockerComposeParser.service";
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
    console.log('C\'est ici que la magie opère !');

    // On instancie les services en singleton pour que plus tard, on puisse faciliter l'accès à ces services et faire les liens entre les objets
    SwaggerParserService.init();
    DockerComposeParserService.init();
};

if(process.env.APP_ENV === 'DEVELOPMENT') {
    main().catch(err => {
        console.error("Erreur lors de l'exécution de la fonction main:", err);
        process.exit(1);
    });
}