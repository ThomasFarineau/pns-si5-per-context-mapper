import * as dotenv from 'dotenv';
dotenv.config();

import * as SwaggerParser from '@apidevtools/swagger-parser';
import * as fs from "fs";
import util from 'util';
const readdir = util.promisify(fs.readdir);
import {Project} from "./Project";

/**
 * Classe de parsing des swaggers
 *
 * @class SwaggerParserService
 * @name SwaggerParserService
 *
 * @author Thomas Farineau
 * @date 05/02/2024
 *
 * @see https://apidevtools.org/swagger-parser/docs/swagger-parser.html
 */
export class SwaggerParserService {
    /**
     * Fonction d'initialisation de la classe
     *
     * @function init
     * @name init
     * @example SwaggerParserService.init()
     * @returns {void}
     *
     */
    init(): void {
        console.log('classe de parsing des swaggers');
        if(process.env.APP_ENV === 'DEVELOPMENT') this.initTest();
    }

    /**
     * Vérifie si le fichier est un fichier swagger basé sur nos critères de nommage
     *
     * Un fichier doit avoir un nom contenant : "swagger", "openapi" ou "api" et une extension .json, .yml ou .yaml.
     *
     * @param file {string} - Le fichier à vérifier
     * @returns {boolean} - true si le fichier est un fichier swagger, false sinon
     */
    isSwaggerFile(file: string): boolean {
        return (file.includes('swagger') || file.includes('openapi') || file.includes('api')) && (file.endsWith('.json') || file.endsWith('.yml') || file.endsWith('.yaml'));
    }

    /**
     * Vérifie si le fichier doit être ignoré ou non
     * @param file {string} - Le fichier à vérifier
     * @returns {boolean} - true si le fichier doit être ignoré, false sinon
     */
    shouldIgnoreFile(file: string): boolean {
        return file.includes('node_modules') || file.includes('.git') || file.includes('.idea') || file.includes('.vscode');
    }

    /**
     * Fonction récursive pour trouver les fichiers swagger dans un dossier
     *
     * @param path {string} - Le chemin du dossier à parcourir
     * @param project {Project} - Le projet auquel ajouter les fichiers swagger
     *
     * @returns {Promise<void>}
     */
    async findSwaggerFiles(path: string, project: Project): Promise<void> {
        const entries = await readdir(path);
        for (const entry of entries) {
            if (this.shouldIgnoreFile(entry)) continue;
            const fullPath = `${path}/${entry}`;
            const entryStats = fs.statSync(fullPath);
            if (entryStats.isDirectory()) {
                await this.findSwaggerFiles(fullPath, project);
            } else if (this.isSwaggerFile(entry)) {
                project.addSwaggerFile(fullPath);
            }
        }
    }

    /**
     * Fonction de test pour l'initialisation des projets dans ./projects dans un environnement de développement
     *
     * @returns {void}
     */
    initTest(): void {
        let projects: Project[] = [];

        readdir('./projects').then(directories => {
            // Créer un tableau de promesses pour chaque dossier trouvé
            let promises = directories.map(async directory => {
                try {
                    await readdir(`./projects/${directory}`);
                    let project = new Project(directory);
                    await this.findSwaggerFiles(`./projects/${directory}`, project);
                    projects.push(project);
                } catch (ignoredError) {}
            });

            Promise.all(promises).then(() => {
                projects.forEach(project => {
                    console.log(project)
                    /*
                    @todo : pour chaque projet, parser les fichiers swagger
                     */
                })
            }).catch(err => {
                console.error("Erreur lors de la récupération des projets: ", err);
            });
        }).catch(err => {
            console.error("Erreur lors de la lecture du répertoire ./projects: ", err);
        });
    }
}