import fs from "fs";
import path from "path";
import { Product } from "@/types/product";

const PRODUCTS_DIR = path.join(process.cwd(), "public/images/products");
const PRODUCTS_JSON = path.join(process.cwd(), "data/products.json");

const CATEGORIES = [
  { slug: "processors", name: "Processors", keywords: ["processor", "cpu", "ryzen", "core i3", "core i5", "core i7", "core i9", "xeon"] },
  { slug: "graphics-cards", name: "Graphics Cards", keywords: ["gpu", "graphics", "geforce", "rtx", "gtx", "radeon", "rx "] },
  { slug: "motherboards", name: "Motherboards", keywords: ["motherboard", "mobo", "b650", "b760", "x670", "z790"] },
  { slug: "memory", name: "Memory (RAM)", keywords: ["ram", "ddr4", "ddr5", "memory", "vengeance"] },
  { slug: "storage", name: "Storage", keywords: ["ssd", "hdd", "nvme", "storage", "tb"] },
  { slug: "monitors", name: "Monitors", keywords: ["monitor", "display", "inch", "240hz", "144hz"] },
  { slug: "power-supply", name: "Power Supply", keywords: ["psu", "power supply", "smps", "watt", "750w", "850w"] },
  { slug: "cabinets", name: "Cabinets", keywords: ["cabinet", "case", "chassis", "tower"] },
  { slug: "laptops", name: "Laptops", keywords: ["laptop", "notebook", "thinkpad", "vivobook"] },
  { slug: "peripherals", name: "Peripherals", keywords: ["keyboard", "mouse", "headset", "webcam", "logitech"] },
  { slug: "networking", name: "Networking", keywords: ["router", "switch", "wifi", "tp-link"] },
  { slug: "prebuilt-pcs", name: "Pre-built PCs", keywords: ["desktop pc", "prebuilt", "gaming pc"] },
];

const BRANDS = [
  "Intel", "AMD", "NVIDIA", "ASUS", "MSI", "Dell", "Lenovo", "Samsung",
  "Corsair", "Logitech", "LG", "TP-Link", "Gigabyte", "Western Digital",
  "WD", "G.Skill", "NZXT", "Lian Li", "Cooler Master", "Keychron", "Infotoolz",
  "HP", "Acer", "Apple", "BenQ", "Crucial", "Kingston", "Seagate",
];

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/\.(png|jpg|jpeg|webp)$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function titleCaseFromFilename(filename: string): string {
  const base = filename.replace(/\.(png|jpg|jpeg|webp)$/i, "");
  return base
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Camera roll / phone defaults — user can rename products later in the catalog. */
export function isGenericFilename(filename: string): boolean {
  const base = filename.replace(/\.(png|jpg|jpeg|webp)$/i, "").trim();
  if (!base) return true;

  const genericPatterns = [
    /^img[_\s-]?\d*$/i,
    /^dsc[_\s-]?\d*$/i,
    /^photo[_\s-]?\d*$/i,
    /^image[_\s-]?\d*$/i,
    /^picture[_\s-]?\d*$/i,
    /^snap[_\s-]?\d*$/i,
    /^pxl_/i,
    /^whatsapp[\s_-]?image/i,
    /^screenshot/i,
    /^untitled/i,
    /^unnamed/i,
    /^camera[_\s-]?\d*$/i,
    /^mvimg/i,
    /^\d{1,6}$/,
  ];

  return genericPatterns.some((pattern) => pattern.test(base));
}

function nextAutoProductNumber(existing: Product[]): number {
  let max = 0;

  for (const product of existing) {
    const nameMatch = product.name.match(/^Product (\d+)$/i);
    if (nameMatch) max = Math.max(max, parseInt(nameMatch[1], 10));

    const slugMatch = product.slug.match(/^product-(\d+)$/);
    if (slugMatch) max = Math.max(max, parseInt(slugMatch[1], 10));
  }

  return max + 1;
}

function detectBrand(name: string): string {
  const lower = name.toLowerCase();
  for (const brand of BRANDS) {
    if (lower.includes(brand.toLowerCase())) return brand;
  }
  return name.split(/[\s-]+/)[0] || "Infotoolz";
}

function detectCategory(name: string) {
  const lower = name.toLowerCase();
  for (const cat of CATEGORIES) {
    if (cat.keywords.some((kw) => lower.includes(kw))) {
      return { slug: cat.slug, name: cat.name };
    }
  }
  return { slug: "peripherals", name: "Peripherals" };
}

function getCategoryBySlug(slug: string | null | undefined) {
  if (!slug) return null;
  return CATEGORIES.find((cat) => cat.slug === slug) ?? null;
}

function buildDescription(name: string, category: string): string {
  return `Genuine ${name} — available from Infotoolz. Contact us for availability, bulk orders, and expert advice. Category: ${category}.`;
}

function loadProducts() {
  if (!fs.existsSync(PRODUCTS_JSON)) return [];
  return JSON.parse(fs.readFileSync(PRODUCTS_JSON, "utf8"));
}

function saveProducts(products: unknown[]) {
  fs.writeFileSync(PRODUCTS_JSON, JSON.stringify(products, null, 2));
}

export function importProductFromFile(
  filename: string,
  buffer: Buffer,
  options: { categorySlug?: string } = {}
) {
  fs.mkdirSync(PRODUCTS_DIR, { recursive: true });

  const existing = loadProducts() as Product[];
  const ext = path.extname(filename).toLowerCase() || ".png";
  const generic = isGenericFilename(filename);

  const slug = generic
    ? `product-${String(nextAutoProductNumber(existing)).padStart(3, "0")}`
    : slugify(filename);
  const name = generic ? `Product ${parseInt(slug.replace(/\D/g, ""), 10)}` : titleCaseFromFilename(filename);

  const brand = detectBrand(name);
  const category = getCategoryBySlug(options.categorySlug) ?? detectCategory(name);
  const imagePath = `/images/products/${slug}${ext}`;
  const destPath = path.join(PRODUCTS_DIR, `${slug}${ext}`);

  fs.writeFileSync(destPath, buffer);

  const bySlug = new Map<string, Product>(existing.map((p) => [p.slug, p]));
  const prev = generic ? undefined : bySlug.get(slug);

  const idNums = existing
    .map((p) => parseInt(p.id.replace(/\D/g, ""), 10))
    .filter((n) => !isNaN(n));
  const nextId = `p${(idNums.length ? Math.max(...idNums) : 0) + 1}`;

  const product: Product = {
    id: prev?.id ?? nextId,
    name,
    slug,
    category: category.name,
    categorySlug: category.slug,
    brand,
    inStock: true,
    featured: prev?.featured ?? false,
    description: buildDescription(name, category.name),
    specs: prev?.specs ?? {},
    image: imagePath,
    tags: [category.slug, brand.toLowerCase()],
  };

  bySlug.set(slug, product);
  const merged = Array.from(bySlug.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  saveProducts(merged);

  return { name, slug, image: imagePath, category: category.name, categorySlug: category.slug };
}
