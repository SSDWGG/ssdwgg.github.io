# Configuration

This page summarizes the most important VitePress configuration points in this project.

## Main config file

- VitePress site config lives in `docs/.vitepress/config.mts`
- Shared locale setup for Chinese and English also lives there
- Markdown plugins, search, sitemap, and Vite plugins are configured in the same file

## Important sections

- `locales`: defines `/zh/` and `/en/`
- `themeConfig.locales`: customizes nav, sidebar, footer, and labels per language
- `markdown`: enables line numbers, task lists, Mermaid, timeline, and custom rendering
- `vite`: customizes bundling and third-party plugin behavior

## Recommended workflow

- edit content under `docs/zh` or `docs/en`
- edit UI and routing under `docs/.vitepress/config.mts`
- run `pnpm docs:dev` to verify changes locally
