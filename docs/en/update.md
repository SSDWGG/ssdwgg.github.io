# Update and Uninstall

When you update VitePress or related plugins, verify both locales after the upgrade.

## Recommended checklist

- update dependencies
- run `pnpm docs:build`
- open `/zh/` and `/en/`
- verify search, nav, sidebar, and language switching

## If you remove a plugin

- delete the dependency
- remove its config from `docs/.vitepress/config.mts`
- remove any page syntax that depends on it

## Keep changes focused

Update one plugin group at a time so broken behavior is easier to isolate.
