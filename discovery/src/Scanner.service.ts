import {Project} from "./Project";
import * as fs from "fs";
import util from 'util';

const readdir = util.promisify(fs.readdir);

/**
 * Service de scan des projets
 *
 */
export class ScannerService {

    /**
     * Fonction d'initialisation de la classe
     * @returns {Promise<Project[]>} - Les projets initialisés
     * @function init
     * @name init
     * @example ScannerService.init()
     * @async
     */
    init(): Promise<Project[]> {
        return new Promise((resolve, reject) => {
            if (process.env.APP_ENV === 'DEVELOPMENT') {
                this.initTest().then((projects) => {
                    resolve(projects);
                })
            } else {
                resolve([]);
            }
        })
    }


    /**
     * Vérifie si le fichier est un fichier swagger basé sur nos critères de nommage
     *
     * @param file {string} - Le fichier à vérifier
     * @returns {boolean} - true si le fichier est un fichier swagger, false sinon
     */
    isSwaggerFile(file: string): boolean {
        let includes = process.env.OPEN_API_INCLUDES ?? '';
        let excludes = process.env.OPEN_API_EXCLUDES ?? '';
        let extensions = process.env.OPEN_API_EXTENSIONS ?? '';

        return this.isNamingConventionCompliant(file, includes, excludes, extensions);
    }

    /**
     * Vérifie si le fichier est conforme à la convention de nommage
     * @param file {string}
     * @param includes {string}
     * @param excludes {string}
     * @param extensions {string}
     *
     * @returns {boolean} - true si le fichier est conforme à la convention de nommage, false sinon
     */
    isNamingConventionCompliant(file: string, includes: string, excludes: string, extensions: string): boolean {
        let includesArray = includes.split(',');
        let excludesArray = excludes.split(',');
        let extensionsArray = extensions.split(',');

        if (excludesArray.includes('')) excludesArray = [];
        if (excludesArray.some(ignore => file.includes(ignore))) return false;

        return includesArray.some(include => file.includes(include) && extensionsArray.some(extension => file.endsWith(extension)));
    }

    /**
     * Vérifie si le fichier doit être ignoré ou non
     * @param file {string} - Le fichier à vérifier
     * @returns {boolean} - true si le fichier doit être ignoré, false sinon
     */
    shouldIgnoreFile(file: string): boolean {
        let ignores = process.env.SCAN_IGNORES ?? '';
        let ignoresArray = ignores.split(',');

        return ignoresArray.some(ignore => file.includes(ignore));
    }

    /**
     * Fonction récursive pour trouver les fichiers swagger dans un dossier
     *
     * @param path {string} - Le chemin du dossier à parcourir
     * @param project {Project} - Le projet auquel ajouter les fichiers swagger
     *
     * @returns {Promise<void>}
     */
    async fileScanner(path: string, project: Project): Promise<void> {
        const entries = await readdir(path);
        for (const entry of entries) {
            if (this.shouldIgnoreFile(entry)) continue;
            const fullPath = `${path}/${entry}`;
            const entryStats = fs.statSync(fullPath);
            if (entryStats.isDirectory()) {
                await this.fileScanner(fullPath, project);
            } else if (this.isSwaggerFile(entry)) {
                project.addSwaggerFile(fullPath);
            } else if (this.isDockerComposeFile(entry)) {
                project.addDockerComposeFile(fullPath);
            }
        }
    }

    /**
     * Fonction de test pour l'initialisation des projets dans ./projects dans un environnement de développement
     *
     * @returns {void}
     *
     */
    initTest(): Promise<Project[]> {
        return new Promise((resolve, reject) => {
            let projects: Project[] = [];
            readdir('./projects').then(directories => {
                // Créer un tableau de promesses pour chaque dossier trouvé
                let promises = directories.map(async directory => {
                    try {
                        await readdir(`./projects/${directory}`);
                        let project = new Project(directory);
                        await this.fileScanner(`./projects/${directory}`, project);
                        projects.push(project);
                    } catch (ignoredError) {
                    }
                });

                Promise.all(promises).then(() => {
                    return resolve(projects);
                }).catch(err => {
                    console.error("Erreur lors de la récupération des projets: ", err);
                });
            }).catch(err => {
                console.error("Erreur lors de la lecture du répertoire ./projects: ", err);
            });
        })
    }


    /**
     * Vérifie si le fichier est un fichier docker-compose basé sur nos critères de nommage
     *
     * @param file {string} - Le fichier à vérifier
     * @returns {boolean} - true si le fichier est un fichier docker-compose, false sinon
     */
    isDockerComposeFile(file: string): boolean {
        let includes = process.env.DOCKER_COMPOSE_INCLUDES ?? '';
        let excludes = process.env.DOCKER_COMPOSE_EXCLUDES ?? '';
        let extensions = process.env.DOCKER_COMPOSE_EXTENSIONS ?? '';

        return this.isNamingConventionCompliant(file, includes, excludes, extensions);
    }
}