# Language Switch

This site uses the built-in VitePress `locales` configuration.

## Current setup

- `root` locale: Simplified Chinese
- `en` locale: English
- Root docs path: `/`
- English docs path: `/en/`

## How switching works

After enabling `locales` in `docs/.vitepress/config.mts`, VitePress shows a language switcher in the top navigation.

To make a page available in English, add the translated file under `docs/en/` with the same purpose as the Chinese page.

## Suggested structure

- `docs/index.md`
- `docs/getting-started.md`
- `docs/en/index.md`
- `docs/en/getting-started.md`
