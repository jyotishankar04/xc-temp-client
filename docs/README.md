# Frontend documentation

The frontend application hosts the public XecureCode documentation under
`/docs`. The docs are powered by Fumadocs, use App Router routing, and load
MDX content from `content/docs`.

## Public docs structure

The docs site uses Fumadocs layout components in
`app/(marketing)/docs/layout.tsx`. The page renderer lives in
`app/(marketing)/docs/[[...slug]]/page.tsx`, and Fumadocs generates the sidebar
from `content/docs/meta.json` files.

Primary public docs routes include:

- `/docs`
- `/docs/getting-started`
- `/docs/concepts`
- `/docs/api`
- `/docs/dashboard`
- `/docs/troubleshooting`
- `/docs/sdk`

Source content lives in:

- `content/docs/index.mdx`
- `content/docs/*.mdx`
- `content/docs/sdk/**/*.mdx`
- `content/docs/**/meta.json`

## Writing guidelines

Docs pages are for external developers. Keep content practical, accurate, and
connected to real backend routes and SDK behavior.

- Use `XecureCode` as the product name.
- Prefer direct setup steps over marketing copy.
- Keep API examples aligned with backend validators.
- Keep SDK examples aligned with the SDK repository.
- Use MDX frontmatter for page titles and descriptions.
- Keep `meta.json` files updated when adding, removing, or reordering pages.

## Verification

Run frontend checks after changing public docs pages.

```bash
pnpm lint
pnpm build
```

## Next steps

When backend or SDK behavior changes, update the public docs and the matching
repo-local reference docs in the same change.
