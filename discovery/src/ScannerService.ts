import {Project} from "./Project";
import * as fs from "fs";
import util from 'util';
import * as Path from "path";

const readdir = util.promisify(fs.readdir);

/**
 * Service de scan des projets
 *
 */
export class ScannerService {
    skipNaming: boolean = false;

    /**
     * Fonction d'initialisation de la classe
     * @returns {Promise<Project[]>} - Les projets initialisés
     * @function init
     * @param {string} url - L'url à scanner (optionnel)
     * @param {boolean} skipNaming - Si true, ignore la convention de nommage
     * @name init
     * @example ScannerService.init()
     * @async
     */
    init(url: string = "", skipNaming: boolean = false): Promise<Project[]> {
        this.skipNaming = skipNaming;
        return new Promise((resolve, reject) => {
            // @ts-ignore
            let env: 'LOCAL' | 'DISTANT' = process.env.APP_ENV ?? "LOCAL"
            this.initProjects(env, url).then((projects) => {
                resolve(projects);
            })
        })
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
    private isNamingConventionCompliant(file: string, includes: string, excludes: string, extensions: string): boolean {
        let includesArray = includes.split(',');
        let excludesArray = excludes.split(',');
        let extensionsArray = extensions.split(',');

        if (this.skipNaming) {
            return extensionsArray.some(extension => file.endsWith(extension));
        }

        if (excludesArray.includes('')) excludesArray = [];
        if (excludesArray.some(ignore => file.includes(ignore))) return false;

        return includesArray.some(include => file.includes(include) && extensionsArray.some(extension => file.endsWith(extension)));
    }

    /**
     * Vérifie si le fichier doit être ignoré ou non
     * @param file {string} - Le fichier à vérifier
     * @returns {boolean} - true si le fichier doit être ignoré, false sinon
     */
    private shouldIgnoreFile(file: string): boolean {
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
    private async fileScanner(path: string, project: Project): Promise<void> {
        const entries = await readdir(path);
        for (const entry of entries) {
            if (this.shouldIgnoreFile(entry)) continue;
            const fullPath = path + Path.sep + entry;
            const entryStats = fs.statSync(fullPath);
            if (entryStats.isDirectory()) {
                await this.fileScanner(fullPath, project);
            }
            if (this.isSwaggerFile(entry)) {
                project.addSwaggerFile(fullPath);
            }
            if (this.isDockerComposeFile(entry)) {
                project.addDockerComposeFile(fullPath);
            }
        }
    }

    /**
     * Fonction pour l'initialisation des projets en mode DEVELOPMENT ou PRODUCTION
     *
     * @param mode {string} - Le mode d'initialisation ('LOCAL' ou 'DISTANT')
     * @param url {string} - L'url à scanner (optionnel, utilisé seulement en mode DISTANT)
     * @returns {Promise<Project[]>} - Les projets initialisés (un tableau pour LOCAL, un seul objet pour DISTANT)
     */
    private initProjects(mode: 'LOCAL' | 'DISTANT', url: string = ""): Promise<Project[]> {
        let scanDir = mode === 'LOCAL' ? './projects' : '..';
        if (mode === 'DISTANT' && url !== "") {
            scanDir = url;
        }
        let projects: Project[] = [];
        return new Promise((resolve, reject) => {
            readdir(scanDir).then(directories => {
                let promises = directories.map(async directory => {
                    try {
                        await readdir(scanDir + Path.sep + directory);
                        let project = new Project(mode === 'LOCAL' ? directory : 'project');
                        project.alphaNumericName();
                        await this.fileScanner(scanDir + Path.sep + directory, project);
                        if (mode === 'DISTANT') {
                            return resolve([project]);
                        } else {
                            projects.push(project);
                        }
                    } catch (ignoredError) {
                    }
                });

                if (mode === 'LOCAL') {
                    Promise.all(promises).then(() => {
                        return resolve(projects);
                    }).catch(err => {
                        console.error("Erreur lors de la récupération des projets: ", err);
                    });
                }
            }).catch(err => {
                console.error(`Erreur lors de la lecture du répertoire ${scanDir}: `, err);
            });
        });
    }

    /**
     * Vérifie si le fichier est un fichier docker-compose basé sur nos critères de nommage
     *
     * @param file {string} - Le fichier à vérifier
     * @returns {boolean} - true si le fichier est un fichier docker-compose, false sinon
     */
    private isDockerComposeFile(file: string): boolean {
        let includes = process.env.DOCKER_COMPOSE_INCLUDES ?? '';
        let excludes = process.env.DOCKER_COMPOSE_EXCLUDES ?? '';
        let extensions = process.env.DOCKER_COMPOSE_EXTENSIONS ?? '';

        return this.isNamingConventionCompliant(file, includes, excludes, extensions);
    }

    /**
     * Vérifie si le fichier est un fichier swagger basé sur nos critères de nommage
     *
     * @param file {string} - Le fichier à vérifier
     * @returns {boolean} - true si le fichier est un fichier swagger, false sinon
     */
    private isSwaggerFile(file: string): boolean {
        let includes = process.env.OPEN_API_INCLUDES ?? '';
        let excludes = process.env.OPEN_API_EXCLUDES ?? '';
        let extensions = process.env.OPEN_API_EXTENSIONS ?? '';

        return this.isNamingConventionCompliant(file, includes, excludes, extensions);
    }
}