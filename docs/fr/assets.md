# Déploiement statique

VitePress génère des fichiers statiques à partir du dossier `docs/`.

## Construction

```bash
pnpm docs:build
```

La sortie est générée dans `docs/.vitepress/dist/`.

## Points importants

- ne modifiez pas le dossier `dist` à la main ;
- gardez les chemins d’assets cohérents avec `base` ;
- vérifiez les images, favicons et fichiers publics sous `docs/public/` ;
- ne commitez pas les secrets de déploiement.

## Déploiement local

Le dépôt contient un script de déploiement local qui construit le site puis synchronise `docs/.vitepress/dist/` vers le serveur configuré. Les variables sensibles doivent rester dans `.env.deploy.local`.

## Références

- Version chinoise : `/zh/assets`
- Version anglaise : `/en/assets`

