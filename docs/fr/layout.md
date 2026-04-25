# Mise en page

VitePress expose des slots et des layouts qui permettent de personnaliser l’apparence du site.

## Layouts courants

- `doc` : page de documentation standard ;
- `home` : page d’accueil avec `hero` et `features` ;
- layouts personnalisés : via le thème local.

## Dans ce projet

Le thème est étendu dans `docs/.vitepress/theme/index.ts`. Plusieurs composants globaux y sont enregistrés pour être utilisés directement dans les fichiers Markdown.

## Conseils

- utilisez `layout: home` uniquement pour les vraies pages d’accueil ;
- gardez les pages de documentation en layout standard ;
- placez les comportements transverses dans le thème plutôt que dans chaque page.

## Références

- Version chinoise : `/zh/layout`
- Version anglaise : `/en/layout`

