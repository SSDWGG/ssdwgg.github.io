# Démarrage

Cette page résume le flux de travail local pour contribuer au site.

## Prérequis

- Node.js installé localement ;
- `pnpm`, utilisé comme gestionnaire de paquets du projet ;
- un terminal capable d’exécuter les scripts du dépôt.

## Installation

Depuis la racine du projet :

```bash
pnpm install
```

## Développement local

Lancez le serveur VitePress :

```bash
pnpm docs:dev
```

Le contenu principal se trouve sous `docs/`. Les pages françaises se trouvent sous `docs/fr/`.

## Construction

Avant de valider une modification importante, vérifiez la génération statique :

```bash
pnpm docs:build
```

## Où modifier quoi

- contenu : `docs/zh`, `docs/en`, `docs/fr` ;
- navigation et sidebar : `docs/.vitepress/config.mts` ;
- composants de thème : `docs/.vitepress/theme/components` ;
- textes partagés de composants : `docs/.vitepress/theme/untils/locale.ts`.

## Étape suivante

Lisez `Configuration` pour comprendre comment les locales, la recherche, les plugins Markdown et le thème sont branchés.

