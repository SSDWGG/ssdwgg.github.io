# Recherche

Le site utilise la recherche locale intégrée de VitePress.

## Configuration

La configuration se trouve dans `docs/.vitepress/config.mts`, sous :

```ts
themeConfig: {
  search: {
    provider: 'local'
  }
}
```

## Textes localisés

Les libellés de recherche sont définis pour :

- `zh` ;
- `en` ;
- `fr`.

## Quand envisager Algolia

La recherche locale suffit pour un site personnel ou une documentation de taille modérée. Algolia devient utile si le site grandit fortement, si la pertinence doit être plus fine ou si l’équipe veut des statistiques de recherche.

## Références

- Version chinoise : `/zh/docsearch`
- Version anglaise : `/en/docsearch`

