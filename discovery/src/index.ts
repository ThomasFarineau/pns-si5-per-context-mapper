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
    console.log('C\'est ici que la magie opère !');
};

if(process.env.APP_ENV === 'DEVELOPMENT') {
    main().catch(err => {
        console.error("Erreur lors de l'exécution de la fonction main:", err);
        process.exit(1);
    });
}