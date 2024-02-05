/**
 * Représente un projet
 *
 * @property {string[]} files - Les fichiers swagger du projet
 * @property {string} name - Le nom du projet
 */
export class Project {
  files: string[] = [];

  constructor(public name: string) {}

  /**
   * Ajoute un fichier swagger au projet
   * @param file
   */
  addSwaggerFile(file: string): void {
    this.files.push(file);
  }

  /**
   * Retourne les fichiers swagger du projet
   *
   * @returns {string[]}
   */
  get swaggerFiles(): string[] {
    return this.files;
  }
}