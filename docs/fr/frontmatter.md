# Frontmatter

Le frontmatter est le bloc YAML placé au début d’un fichier Markdown. Il sert à ajuster le comportement d’une page sans écrire de code de thème.

## Exemple

```md
---
title: Ma page
outline: deep
sidebar: true
---

# Ma page
```

## Usages courants

- `title` : titre de la page ;
- `titleTemplate` : suffixe ou format du titre ;
- `layout` : type de layout, par exemple `home` ;
- `sidebar` : affichage ou désactivation de la sidebar ;
- `outline` : profondeur du sommaire ;
- `editLink`, `prev`, `next` : contrôle des liens automatiques.

## Page d’accueil

Les pages `docs/fr/index.md`, `docs/en/index.md` et `docs/zh/index.md` utilisent `layout: home` avec une section `hero` et une liste `features`.

## Références

- Version chinoise : `/zh/frontmatter`
- Version anglaise : `/en/frontmatter`

