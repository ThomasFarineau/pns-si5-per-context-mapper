import * as fs from "fs";
import clone from 'git-clone/promise';
import util from "util";
import * as Path from "path";
const rm = util.promisify(fs.rm);
const tmp = '.' + Path.sep + "temp";

/**
 * Classe qui permet de cloner un repository git dans un dossier temporaire
 *
 * @class RepoManager
 * @name RepoManager
 */
class RepoManager {
    constructor() {
        this.clear();
        fs.mkdirSync(tmp);
    }

    /**
     * Fonction qui clone un repository git dans un dossier temporaire
     * @param url {string} - L'url du repository
     * @returns {Promise<string>} - Le chemin du dossier temporaire
     */
    async clone(url: string): Promise<string> {
        return new Promise((resolve) => {
            console.log('Cloning repository from ' + url + ' into ' + tmp + '...');
            clone(url, tmp, {checkout: 'master'}).then(() => {
                console.log('Repository cloned successfully');
            }).catch(err => {
                console.error('Error while cloning repository: ', err);
            }).finally(() => {
                let toRemove = ['.git', '.github', '.gitignore', '.gitattributes'];
                let promises = toRemove.map(async (file) => {
                    return rm('./temp/' + file, {recursive: true}).then(() => {
                        console.log('Removed ' + file)
                    }).catch(ignore => {
                    })
                });
                Promise.all(promises).then(() => {
                    console.log('Repository cloned');
                    resolve(tmp);
                });
            })
        });

    }

    /**
     * Fonction qui supprime le dossier temporaire
     * @returns {void}
     */
    clear(): void {
        if (fs.existsSync(tmp)) {
            fs.rmSync(tmp, {recursive: true});
        }
    }
}

const repoManager = new RepoManager();

export const cloneRepo = async (url: string): Promise<string> => new Promise((resolve) => repoManager.clone(url).then((url) => {
    resolve(url)
}));

export const deleteRepo = () => repoManager.clear()