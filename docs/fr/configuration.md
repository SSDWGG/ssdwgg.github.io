# Configuration

La configuration principale du site se trouve dans `docs/.vitepress/config.mts`.

## Fichier principal

Ce fichier regroupe :

- les informations du site ;
- les locales `/zh/`, `/en/` et `/fr/` ;
- les barres de navigation et sidebars ;
- la recherche locale ;
- les plugins Markdown ;
- les réglages Vite et le découpage des bundles.

## Sections importantes

- `locales` définit les langues, les libellés, les chemins et les réglages de thème propres à chaque langue ;
- `themeConfig` contient la configuration partagée du thème ;
- `markdown` active les numéros de ligne, les tâches, Mermaid, la timeline et les remplacements localisés ;
- `vite` règle les plugins et quelques optimisations de build.

## Flux conseillé

1. Ajoutez ou modifiez une page dans `docs/fr/`.
2. Ajoutez le lien correspondant dans `frSidebar`.
3. Si la page doit apparaître dans le menu supérieur, ajoutez-la dans `frNav`.
4. Lancez `pnpm docs:build` pour vérifier que les liens et la génération fonctionnent.

## Références

- Version chinoise : `/zh/configuration`
- Version anglaise : `/en/configuration`

