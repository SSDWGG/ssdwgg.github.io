# Assets

Static assets in this project are served from `docs/public`.

## Recommended usage

- images: `![alt](/image.png)`
- icons and logos: reference them from `/...`
- PDFs, audio, and videos can also be placed in `docs/public`

## Why this matters

Files inside `docs/public` are copied as-is during build, so the same asset path works for both:

- `/zh/...`
- `/en/...`

## Example

If `docs/public/favicon.ico` exists, reference it as:

- `/favicon.ico`
