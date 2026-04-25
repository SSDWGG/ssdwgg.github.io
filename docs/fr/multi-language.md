# Multilingue

Le site utilise la configuration `locales` de VitePress pour proposer plusieurs langues.

## État actuel

- Chinois : `/zh/`
- Anglais : `/en/`
- Français : `/fr/`
- Page racine : sélection de langue et liens vers les locales

## Ajouter une page française

1. Créez le fichier sous `docs/fr/`.
2. Reprenez la même intention que la page chinoise ou anglaise.
3. Ajoutez le lien dans `frSidebar`.
4. Vérifiez la génération avec `pnpm docs:build`.

## Structure recommandée

```txt
docs/
  zh/getting-started.md
  en/getting-started.md
  fr/getting-started.md
```

## Points d’attention

- une page absente dans une locale peut créer un lien cassé ;
- les composants partagés doivent lire les textes depuis `locale.ts` ;
- les liens internes doivent cibler la bonne locale.

## Références

- Version chinoise : `/zh/multi-language`
- Version anglaise : `/en/multi-language`

