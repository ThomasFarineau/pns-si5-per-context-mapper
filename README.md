


```bash
java -jar cml-parser/
```
pour générer le jar.

```bash
./start.sh [lien GitHub]
```
pour lancer l'application.
La présence d'un lien GitHub va le cloner et l'utiliser. En l'absence de ce lien, l'application utilise les fichiers présents dans [discovery/projects](discovery/projects).

Un fichier [dependencies.yaml](discovery/projects/openbanking/dependencies.yaml) (que vous pourrez modifier) sera généré si un fichier Docker Compose est présent dans le projet. Autrement, il sera nécessaire d'en fournir un pour avoir des relations pertinentes entre les services.
