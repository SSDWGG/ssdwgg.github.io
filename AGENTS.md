# Repository Instructions

- Before each `git push`, update both changelog pages to reflect the latest meaningful changes:
  - `docs/zh/changelog.md`
  - `docs/en/changelog.md`
- Keep changelog entries concise, grouped by date or release, and summarize repeated test/deploy commits instead of listing them one by one.

## Development

- Use `pnpm` as the package manager.
- Run `pnpm docs:build` to build the VitePress site.
- Main content lives under `docs/`.
- Chinese technical tool docs live under `docs/zh/tech-tools/`.
- Shared VitePress theme components live under `docs/.vitepress/theme/components/`.
- Shared component locale copy lives in `docs/.vitepress/theme/untils/locale.ts`.

## Local Git Hooks

- Git hooks are stored in `.githooks`.
- Run `pnpm hooks:install` if hooks are not active.
- The `pre-commit` hook runs `scripts/deploy-before-commit.sh`.
- Set `SKIP_PRECOMMIT_DEPLOY=1` before `git commit` only when you intentionally need to skip local build/deploy.

## Local Deployment

- Local deployment builds the site, then syncs `docs/.vitepress/dist/` to the Tencent Cloud server with SSH/rsync.
- Local deploy configuration lives in `.env.deploy.local`; never commit this file.
- Use `.env.deploy.example` as the template for required deploy variables.
- Do not hardcode `DEPLOY_SSH_HOST`, `DEPLOY_SSH_USER`, `DEPLOY_SSH_KEY`, private keys, or server secrets in tracked files.
