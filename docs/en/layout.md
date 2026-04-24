# Layout Slots

VitePress supports multiple page layouts and theme slots.

## Common layouts

- `home`
- `doc`
- `page`

## How this project uses layout customization

- the homepage uses a custom home frontmatter block
- article pages use the documentation layout
- the theme injects extra article metadata after the `h1` heading

## Where to edit

- page-level layout: Markdown frontmatter
- global layout behavior: `docs/.vitepress/theme`
