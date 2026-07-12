#!/usr/bin/env node
/**
 * Import product photos from public/images/uploads/
 *
 * Drop PNG/JPG files named after the product, e.g.:
 *   Intel Core i7-14700K.png
 *   ASUS ROG Strix G16.jpg
 *
 * Run: npm run import:products
 */

import fs from "fs";
import path from "path";

const UPLOADS_DIR = path.join(process.cwd(), "public/images/uploads");
const PRODUCTS_DIR = path.join(process.cwd(), "public/images/products");
const PRODUCTS_JSON = path.join(process.cwd(), "data/products.json");

const CATEGORIES = [
  { slug: "processors", name: "Processors", keywords: ["processor", "cpu", "ryzen", "core i3", "core i5", "core i7", "core i9", "xeon", "threadripper"] },
  { slug: "graphics-cards", name: "Graphics Cards", keywords: ["gpu", "graphics", "geforce", "rtx", "gtx", "radeon", "rx ", "quadro"] },
  { slug: "motherboards", name: "Motherboards", keywords: ["motherboard", "mobo", "b650", "b760", "x670", "z790", "h610", "tomahawk", "strix", "aorus"] },
  { slug: "memory", name: "Memory (RAM)", keywords: ["ram", "ddr4", "ddr5", "memory", "vengeance", "trident"] },
  { slug: "ssd", name: "SSD", keywords: ["ssd", "nvme", "m.2", "m2", "sata ssd", "990 pro", "sn850", "tb ssd"] },
  { slug: "hdd", name: "HDD", keywords: ["hdd", "hard drive", "hard disk", "3.5", "2.5", "barracuda", "ironwolf", "wd blue", "wd red"] },
  { slug: "storage", name: "Storage", keywords: ["storage", "drive", "tb"] },
  { slug: "monitors", name: "Monitors", keywords: ["monitor", "display", "ultragear", "inch", "240hz", "144hz", "4k monitor"] },
  { slug: "power-supply", name: "Power Supply", keywords: ["psu", "power supply", "smps", " rm", " watt", "750w", "850w", "650w"] },
  { slug: "cabinets", name: "Cabinets", keywords: ["cabinet", "case", "chassis", "tower", "nzxt", "lian li", "cooler master case"] },
  { slug: "laptops", name: "Laptops", keywords: ["laptop", "notebook", "thinkpad", "ideapad", "vivobook", "pavilion", "macbook"] },
  { slug: "peripherals", name: "Peripherals", keywords: ["keyboard", "mouse", "headset", "webcam", "speaker", "printer", "scanner", "logitech", "keychron"] },
  { slug: "networking", name: "Networking", keywords: ["router", "switch", "access point", "wifi", "ethernet", "tp-link", "ubiquiti", "lan card"] },
  { slug: "prebuilt-pcs", name: "Pre-built PCs", keywords: ["desktop pc", "prebuilt", "pre-built", "gaming pc", "workstation", "all in one", "aio pc"] },
];

const BRANDS = [
  "Intel", "AMD", "NVIDIA", "ASUS", "MSI", "Dell", "Lenovo", "Samsung",
  "Corsair", "Logitech", "LG", "TP-Link", "Gigabyte", "Western Digital",
  "WD", "G.Skill", "NZXT", "Lian Li", "Cooler Master", "Keychron",
  "Infotoolz", "HP", "Acer", "Apple", "Sony", "Canon", "Epson", "BenQ",
  "ViewSonic", "Crucial", "Kingston", "Seagate", "EVGA", "Zotac", "Sapphire",
  "PowerColor", "XFX", "Antec", "Deepcool", "Thermaltake", "Razer", "SteelSeries",
  "HyperX", "D-Link", "Netgear", "Linksys", "APC", "Zebronics", "TVS",
];

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/\.(png|jpg|jpeg|webp)$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function titleCaseFromFilename(filename) {
  const base = filename.replace(/\.(png|jpg|jpeg|webp)$/i, "");
  return base
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\b(I3|I5|I7|I9|Rx|Rtx|Gtx|Ddrr?4|Ddrr?5|Gb|Tb|Hz|Wifi|Wi-Fi|Usb|Hdmi|Atx|Itx|Ssd|Hdd|Psu|Pc)\b/gi, (m) => m.toUpperCase());
}

function isGenericFilename(filename) {
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

function nextAutoProductNumber(existing) {
  let max = 0;

  for (const product of existing) {
    const nameMatch = product.name.match(/^Product (\d+)$/i);
    if (nameMatch) max = Math.max(max, parseInt(nameMatch[1], 10));

    const slugMatch = product.slug.match(/^product-(\d+)$/);
    if (slugMatch) max = Math.max(max, parseInt(slugMatch[1], 10));
  }

  return max + 1;
}

function detectBrand(name) {
  const lower = name.toLowerCase();
  for (const brand of BRANDS) {
    if (lower.includes(brand.toLowerCase())) return brand;
  }
  const first = name.split(/[\s-]+/)[0];
  return first || "Infotoolz";
}

function detectCategory(name) {
  const lower = name.toLowerCase();
  for (const cat of CATEGORIES) {
    if (cat.keywords.some((kw) => lower.includes(kw))) {
      return { slug: cat.slug, name: cat.name };
    }
  }
  return { slug: "peripherals", name: "Peripherals" };
}

function buildDescription(name, category) {
  return `Genuine ${name} — available from Infotoolz. Browse our ${category} catalog and contact us for availability, bulk orders, and expert advice.`;
}

function loadExistingProducts() {
  if (!fs.existsSync(PRODUCTS_JSON)) return [];
  return JSON.parse(fs.readFileSync(PRODUCTS_JSON, "utf8"));
}

function nextId(existing) {
  const nums = existing
    .map((p) => parseInt(p.id.replace(/\D/g, ""), 10))
    .filter((n) => !isNaN(n));
  return `p${(nums.length ? Math.max(...nums) : 0) + 1}`;
}

async function main() {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  fs.mkdirSync(PRODUCTS_DIR, { recursive: true });

  const files = fs.readdirSync(UPLOADS_DIR).filter((f) =>
    /\.(png|jpg|jpeg|webp)$/i.test(f)
  );

  if (files.length === 0) {
    console.log("No photos found in public/images/uploads/");
    console.log("Drop PNG/JPG files there (any filename is fine), then run again.");
    process.exit(0);
  }

  const existing = loadExistingProducts();
  const bySlug = new Map(existing.map((p) => [p.slug, p]));
  let imported = 0;
  let updated = 0;

  let idCounter = existing.length + 1;

  for (const file of files) {
    const generic = isGenericFilename(file);
    const slug = generic
      ? `product-${String(nextAutoProductNumber([...bySlug.values()])).padStart(3, "0")}`
      : slugify(file);
    const name = generic
      ? `Product ${parseInt(slug.replace(/\D/g, ""), 10)}`
      : titleCaseFromFilename(file);
    const ext = path.extname(file).toLowerCase();
    const destFile = `${slug}${ext}`;
    const destPath = path.join(PRODUCTS_DIR, destFile);
    const srcPath = path.join(UPLOADS_DIR, file);

    fs.copyFileSync(srcPath, destPath);

    const brand = detectBrand(name);
    const category = detectCategory(name);
    const prev = generic ? undefined : bySlug.get(slug);

    const product = {
      id: prev?.id ?? `p${idCounter++}`,
      name,
      slug,
      category: category.name,
      categorySlug: category.slug,
      brand,
      inStock: true,
      description: buildDescription(name, category.name),
      specs: prev?.specs ?? {},
      image: `/images/products/${destFile}`,
      featured: prev?.featured ?? false,
      tags: [category.slug, brand.toLowerCase()],
    };

    if (prev) updated++;
    else imported++;

    bySlug.set(slug, product);
  }

  const products = [...bySlug.values()].sort((a, b) => a.name.localeCompare(b.name));
  fs.writeFileSync(PRODUCTS_JSON, JSON.stringify(products, null, 2));

  console.log(`\nImported ${imported} new product(s), updated ${updated}.`);
  console.log(`Total products in catalog: ${products.length}`);
  console.log(`Saved to data/products.json\n`);

  for (const p of products.filter((_, i) => i < 5)) {
    console.log(`  • ${p.name} → ${p.category} (${p.brand})`);
  }
  if (products.length > 5) console.log(`  … and ${products.length - 5} more`);
}

main().catch(console.error);
