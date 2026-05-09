---
sidebar: false
outline: false
editLink: false
prev: false
next: false
---

# Changelog

> [!IMPORTANT] About these notes
>
> This page is organized from the Git commit history and focuses on meaningful feature, documentation, deployment, and structural changes. Repeated test or deployment-debug commits are grouped together.

> [!TIP]
> Chinese version: `/zh/changelog`

::: timeline 2026-05-09
- Removed SSH remote server deployment scripts and configuration (server decommissioned).
- Switched GitHub Pages source to GitHub Actions workflow, auto-deploying `docs/.vitepress/dist`.
- Repository renamed to `WPD`; updated `base` path, `hostname`, and all repo reference URLs.
- Fixed non-root deployment paths: theme components, CSS, social links, and embedded pages now respect the `/WPD/` deployment prefix.
:::

::: timeline 2026-04-25
- Completed the French documentation set with French navigation, sidebar, changelog, and pages for AI, development, technical tools, and supporting sections.
- Expanded the Chinese `Technical Tools` module with a JavaScript async programming guide covering `Promise`, `async/await`, the event loop, and practical patterns.
- Expanded the Chinese `Technical Tools` module with micro-frontend and frontend engineering guides covering architecture, configuration examples, and build tools such as `Vite`, `Webpack`, and `Rollup`.
- Improved `AGENTS.md` with repository collaboration notes for development, Git hooks, and local deployment.
- Added French locale support for shared theme components, including French site config, search labels, and the French homepage.
- Improved the root entrance page by replacing the single auto-redirect with a Vue-powered bilingual landing page.
- Expanded the Chinese `Technical Tools` module with SaaS and PaaS concepts, use cases, and selection guidance.
- Added a local pre-commit deployment script that builds `VitePress` and syncs the output to the server through SSH/rsync.
:::

::: timeline 2026-04-24
- Expanded the Chinese `Technical Tools` module with OpenCV, Three.js, Vue2, Vue3, and React guides covering usage and core principles.
- Added a new Chinese `Technical Tools` top-level module with Docker, Nginx, and ECS introduction and usage guides.
- Reorganized the documentation into locale-based sections, added the `docs/en` English page set, and updated config plus permalink handling.
- Improved local assets and fallback behavior for the Christmas role module, including models, textures, audio, and related static resources.
- Synced bilingual personal pages so locale switching works cleanly.
- Rewrote the bilingual `development` pages to cover delivery modes, AI collaboration, Git workflow, and Docker-first development guidance.
- Removed the outdated `algorithm` and `plan` sections, along with their related pages, static assets, and sidebar entries.
- Expanded the `AI` preface with a clearer mindset recommendation: adopt AI quickly and make it part of both work and daily life.
:::

::: timeline 2026-04-23
- Cleared temporary memo content to prepare for a cleaner task and note structure.
:::

::: timeline 2026-04-22
- Expanded the AI documentation area with guides for `Codex`, `Claude`, `OpenClaw`, environment setup, and China access notes.
- Improved the `README` and memo section, and continued refining task notes.
- Updated planning and TODO pages to make the AI-related docs more complete.
:::

::: timeline 2026-04-02 ~ 2026-04-03
- Iterated on the GitHub Actions deployment flow and refined auto-deploy details.
- Updated public site addresses and personal page content.
- Added and reorganized core AI documentation pages and related config.
:::

::: timeline 2026-03-13 ~ 2026-03-14
- Added social links and a `Buy Me a Coffee` page with payment QR codes and landing assets.
- Reworked `deploy.yml` several times to verify GitHub Pages and other deployment targets.
- Updated site addresses, logo assets, and several showcase pages.
:::

::: timeline 2026-03-12
- Expanded the homepage and docs with the WeChat external page, Thursday content, and interactive showcase pages such as `Hextris`.
- Added Google Analytics experiments and improved layout, background, and theme component capabilities.
- Fixed theme import issues, build warnings, deployment problems, and dependency setup.
:::

::: timeline 2026-03-09
- Initialized the `VitePress`-based blog and documentation template with custom theme components and core site content.
- Added interactive demo pages, including the Christmas tree and `Hextris`.
- Adjusted search form spacing, global styles, and automated deployment setup.
:::

::: timeline 2024-01 ~ 2024-04
- Continued maintaining the earlier site content and refreshed the `README` before the current documentation structure took shape.
:::

::: timeline 2021-09 ~ 2023-06
- The repository started as a collection of static pages and personal homepage experiments.
- Early history includes many upload, delete, and temporary adjustment commits, so this section stays intentionally high level.
:::
