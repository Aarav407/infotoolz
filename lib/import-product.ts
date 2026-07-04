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

export function importProductFromFile(filename: string, buffer: Buffer) {
  fs.mkdirSync(PRODUCTS_DIR, { recursive: true });

  const slug = slugify(filename);
  const ext = path.extname(filename).toLowerCase() || ".png";
  const name = titleCaseFromFilename(filename);
  const brand = detectBrand(name);
  const category = detectCategory(name);
  const imagePath = `/images/products/${slug}${ext}`;
  const destPath = path.join(PRODUCTS_DIR, `${slug}${ext}`);

  fs.writeFileSync(destPath, buffer);

  const existing = loadProducts() as Product[];
  const bySlug = new Map<string, Product>(existing.map((p) => [p.slug, p]));
  const prev = bySlug.get(slug);

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

  return { name, slug, image: imagePath };
}
