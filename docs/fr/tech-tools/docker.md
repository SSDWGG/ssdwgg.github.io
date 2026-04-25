# Docker

Docker est une plateforme de conteneurisation qui emballe une application, son runtime, ses dépendances et sa commande de démarrage dans une image réutilisable.

## À quoi ça sert

- réduire les différences d’environnement ;
- lancer rapidement bases de données, caches et files de messages ;
- rendre la livraison plus stable ;
- isoler les versions de Node, Java, Python ou MySQL ;
- faciliter CI/CD.

## Concepts clés

| Concept | Description |
| :--- | :--- |
| Image | modèle d’environnement exécutable |
| Conteneur | instance lancée depuis une image |
| Dockerfile | recette de construction d’image |
| Volume | stockage persistant ou montage local |
| Network | communication entre conteneurs |
| Compose | orchestration simple de plusieurs services |

## Commandes utiles

```bash
docker --version
docker run hello-world
docker ps
docker images
docker compose up -d
docker compose logs -f
docker compose down
```

## Bonnes pratiques

- évitez `latest` en production ;
- n’intégrez pas les secrets dans l’image ;
- utilisez `.dockerignore` ;
- externalisez les données persistantes ;
- ajoutez logs, healthchecks et stratégie de redémarrage.

## Références

- Version chinoise : `/zh/tech-tools/docker`

