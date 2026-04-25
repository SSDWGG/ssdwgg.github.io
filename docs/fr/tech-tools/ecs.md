# ECS

ECS désigne généralement un serveur cloud élastique utilisé pour héberger applications, services web, bases de données légères ou tâches d’automatisation.

## Ce qu’un ECS permet

- exécuter un site ou une API ;
- installer Docker, Nginx ou une base de données ;
- déployer des services personnels ;
- contrôler finement réseau, sécurité et stockage.

## Concepts

| Concept | Description |
| :--- | :--- |
| Région | emplacement géographique du serveur |
| Instance | machine virtuelle choisie |
| Image | système d’exploitation initial |
| Groupe de sécurité | règles d’entrée et de sortie |
| Disque | stockage système ou données |
| IP publique | accès depuis Internet |

## Processus de base

1. choisir région et taille ;
2. sélectionner l’image système ;
3. configurer réseau et groupe de sécurité ;
4. créer ou associer une clé SSH ;
5. installer le runtime nécessaire ;
6. déployer l’application.

## Bonnes pratiques

- ouvrez seulement les ports nécessaires ;
- désactivez les accès faibles ;
- sauvegardez les données importantes ;
- mettez le système à jour régulièrement ;
- surveillez CPU, mémoire, disque et logs.

## Références

- Version chinoise : `/zh/tech-tools/ecs`

