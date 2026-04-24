# Plugins

This site uses several VitePress and Markdown plugins to extend the default experience.

## Examples already enabled

- `vitepress-plugin-group-icons`
- `vitepress-plugin-mermaid`
- `vitepress-markdown-timeline`
- `markdown-it-task-checkbox`

## When to add a plugin

- when a feature is reused across multiple pages
- when the feature belongs in build-time rendering
- when custom Markdown syntax improves authoring efficiency

## Before adding more

- verify bundle impact
- prefer lightweight plugins
- keep the configuration centralized in `docs/.vitepress/config.mts`
