# Infotoolz — IT Hardware Catalog

A product showcase website for an IT hardware reseller, inspired by MD Computers. Display-only — no cart or payment gateway.

## Company Details

Configured in `data/company.ts`:

- **Name:** Infotoolz
- **Email:** infotoolzit@gmail.com
- **WhatsApp:** +91 86974 55537

## Logo

Place your logo file at `public/images/logo.png` (or `.svg`) and update the `logo` path in `data/company.ts`. The current logo is an SVG approximation of your brand mark.

## Features

- **Home page** — hero, category grid, featured products
- **Product catalog** — browse all products with search, category, and brand filters
- **Product detail** — specs, pricing, stock status, inquiry CTA
- **Categories** — 12 hardware categories (processors, GPUs, laptops, etc.)
- **About & Contact** — company info and inquiry form (UI only)

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4
- Lucide React icons

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/           # Pages (home, products, categories, about, contact)
components/    # Reusable UI components
data/          # Product and category data (replace with your inventory)
types/         # TypeScript interfaces
public/        # Static assets and product placeholder images
```

## Customization

- Update company name, contact details, and address in `components/Header.tsx`, `components/Footer.tsx`, and `app/contact/page.tsx`
- Replace sample products in `data/products.ts` with your actual inventory
- Adjust categories in `data/categories.ts`
