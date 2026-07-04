<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

This is a display-only Next.js 16 (App Router) + TypeScript + Tailwind CSS 4 static product catalog. There is no database, backend service, or auth — product/category data is bundled in `data/` and pages are statically generated. No secrets or `.env` are required to run it.

- Dev server: `npm run dev` (Turbopack) serves on `http://localhost:3000`. This is the single service.
- Standard commands are in `package.json`: `npm run lint` (ESLint; currently emits a few unused-var warnings, 0 errors), `npm run build`, `npm run start`.
- The catalog left-sidebar category links (`/categories/[slug]`) do the reliable filtering; the products-page search box is a known UI detail and does not always filter live.
- `npm run import:products` reads photos from `public/images/uploads/` and regenerates `data/products.json` via `sharp` — only run it intentionally when adding product photos, since it rewrites data.
