# Mise à jour et désinstallation

Cette page rappelle les vérifications utiles quand une dépendance ou un plugin évolue.

## Checklist de mise à jour

1. Lisez les notes de version.
2. Mettez à jour la dépendance.
3. Lancez le site en local.
4. Vérifiez les pages concernées.
5. Exécutez `pnpm docs:build`.

## Supprimer un plugin

- retirez l’import dans `docs/.vitepress/config.mts` ;
- supprimez l’appel dans `markdown.config` ou `vite.plugins` ;
- nettoyez les usages Markdown associés ;
- vérifiez que les pages ne dépendent plus du plugin.

## Références

- Version chinoise : `/zh/update`
- Version anglaise : `/en/update`

