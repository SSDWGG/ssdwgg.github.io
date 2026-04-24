# Page Config

VitePress pages can be customized with frontmatter and folder-based routing.

## Common page settings

- `title`
- `titleTemplate`
- `layout`
- `lang`
- `aside`
- `outline`
- `lastUpdated`

## Routing rule in this project

- `docs/zh/...` becomes `/zh/...`
- `docs/en/...` becomes `/en/...`
- `docs/index.md` is only used as a redirect page to `/zh/`

## Practical tip

When adding a new page, create both:

- the Chinese page under `docs/zh`
- the English page under `docs/en` if you want it to appear in both locales
