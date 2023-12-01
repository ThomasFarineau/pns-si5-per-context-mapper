# Résumé milestone 1

- On a été en mesure de faire tourner le tuto de Context Mapper et de générer un CML d'exemple.
- On a également un fichier CML qui correspond à un Context Mapping de notre projet d'AL.
- Nous avons créé un fichier Main qui va générer une image de Context Map à partir d'un fichier CML.
- Enfin, nous avons mis en place une CI sur Github Actions qui va générer une l'image mentionnée précédemment et l'upload en tant qu'artifact.

# Résumé milestone 2 

- Les fonctionnalités de Context Mapper et Context Mapper Discovery : 
L'outil Context Mapper excelle dans l'identification des bounded contexts, des Aggregates associés à ces contextes, ainsi que des relations entre ces bounded contexts, en spécifiant également le type de chaque relation et des précisions supplémentaires sur les services offerts par les Bounded Context. En revanche, l'outil Context Mapper Discovery ne parvient pas à déterminer les types de relations, bien qu'il puisse identifier les Aggregates, les bounded contexts (dans le cadre de Spring Boot), et les relations.

- Les [types](https://contextmapper.org/docs/language-reference/) de relations/services identifiés par Context Mapper sont les suivants :

  - Partnership : [P]
  - Shared Kernel : [SK]
  - Customer/Supplier : [C] / [S]
  - Upstream/Downstream : [U] / [D]
  - Conformist : [CF]
  - Open Host Service : [OHS]
  - Anticorruption Layer : [ACL]
  - Published Language : [PL]

- Nous avons réussi à faire fonctionner l'outil contexte mapper discovery avec l'exemple suivant : [Lakeside Mutual](https://github.com/Microservice-API-Patterns/LakesideMutual/tree/master)

- Cependant nous avons des problèmes lors de l'exécution de context mapper discovery avec notre projet, nous supposons que le problème du fonctionnement est dû aux versions springs différentes entre celle du context mapper discovery et celle de notre projet ( 2.6 pour le discovery et notre projet est en 3.2)

- On a modifié la CI pour générer les images de tous les fichiers cml présents dans le dossier [models](https://github.com/DeathStar3-projects/context-mapper-per-23/tree/main/sandbox/context-mapper-forward/src/main/resources/models) de notre sandbox/context-mapper-forward, il faudra (lorsque l'on aura réglé le problème du discovery), rajouter une étape dans la CI qui génère ces fichiers cml à partir de discovery
