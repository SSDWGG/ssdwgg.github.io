# Composants

VitePress permet d’utiliser des composants Vue directement dans les pages Markdown.

## Cas d’usage

- cartes de liens ;
- lecteurs média ;
- animations légères ;
- intégration de pages externes ;
- widgets localisés.

## Dans ce projet

Les composants partagés vivent dans `docs/.vitepress/theme/components/`. Les textes partagés et localisés vivent dans `docs/.vitepress/theme/untils/locale.ts`.

## Bonnes pratiques

- gardez les composants de documentation simples ;
- évitez les dépendances lourdes si une page statique suffit ;
- mettez les textes dans `locale.ts` quand un composant est utilisé par plusieurs langues ;
- vérifiez le rendu avec `pnpm docs:build`.

## Références

- Version chinoise : `/zh/components`
- Version anglaise : `/en/components`

