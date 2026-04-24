# Search

This site currently uses VitePress local search.

## Current behavior

- Chinese UI text is customized for `zh`
- English UI text is customized for `en`
- Search indexes content from both locale directories during build

## Config location

Search settings are defined in `docs/.vitepress/config.mts`.

## If you want to upgrade later

You can replace local search with Algolia DocSearch if you want hosted indexing and richer analytics.
