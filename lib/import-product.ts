import fs from "fs";
import path from "path";
import { Product } from "@/types/product";
import { lookupProductFromName } from "@/lib/product-specs";

const PRODUCTS_DIR = path.join(process.cwd(), "public/images/products");
const PRODUCTS_JSON = path.join(process.cwd(), "data/products.json");
const LOCAL_PRODUCTS_JSON = path.join(process.cwd(), "data/products.local.json");

type LocalCatalog = {
  products: Product[];
  deletedSlugs: string[];
};

const CATEGORIES = [
  { slug: "processors", name: "Processors", keywords: ["processor", "cpu", "ryzen", "core i3", "core i5", "core i7", "core i9", "xeon"] },
  { slug: "graphics-cards", name: "Graphics Cards", keywords: ["gpu", "graphics", "geforce", "rtx", "gtx", "radeon", "rx "] },
  { slug: "motherboards", name: "Motherboards", keywords: ["motherboard", "mobo", "b650", "b760", "x670", "z790"] },
  { slug: "memory", name: "Memory (RAM)", keywords: ["ram", "ddr4", "ddr5", "memory", "vengeance"] },
  { slug: "ssd", name: "SSD", keywords: ["ssd", "nvme", "m.2", "m2", "sata ssd", "990 pro", "sn850"] },
  { slug: "hdd", name: "HDD", keywords: ["hdd", "hard drive", "hard disk", "3.5", "2.5", "barracuda", "ironwolf", "wd blue", "wd red"] },
  { slug: "storage", name: "Storage", keywords: ["storage", "drive", "tb"] },
  { slug: "monitors", name: "Monitors", keywords: ["monitor", "display", "inch", "240hz", "144hz"] },
  { slug: "power-supply", name: "Power Supply", keywords: ["psu", "power supply", "smps", "watt", "750w", "850w"] },
  { slug: "cabinets", name: "Cabinets", keywords: ["cabinet", "case", "chassis", "tower"] },
  { slug: "laptops", name: "Laptops", keywords: ["laptop", "notebook", "thinkpad", "vivobook"] },
  { slug: "peripherals", name: "Peripherals", keywords: ["keyboard", "mouse", "headset", "webcam", "logitech"] },
  { slug: "switches", name: "Switches", keywords: ["switch", "poe switch", "managed switch", "unmanaged switch", "gigabit switch"] },
  { slug: "nas", name: "NAS", keywords: ["nas", "network attached storage", "synology", "qnap", "diskstation", "my cloud"] },
  { slug: "servers", name: "Servers", keywords: ["server", "rack server", "tower server", "poweredge", "proliant", "thinksystem"] },
  { slug: "networking", name: "Networking", keywords: ["router", "wifi", "tp-link", "access point", "network adapter"] },
  { slug: "prebuilt-pcs", name: "Pre-built PCs", keywords: ["desktop pc", "prebuilt", "gaming pc"] },
];

const BRANDS = [
  "Intel", "AMD", "NVIDIA", "ASUS", "MSI", "Dell", "Lenovo", "Samsung",
  "Corsair", "Logitech", "LG", "TP-Link", "Gigabyte", "Western Digital",
  "WD", "G.Skill", "NZXT", "Lian Li", "Cooler Master", "Keychron", "Infotoolz",
  "HP", "Acer", "Apple", "BenQ", "Crucial", "Kingston", "Seagate", "HPE", "Cisco",
  "Synology", "QNAP",
];

const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp"]);

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

function readSeedProducts(): Product[] {
  if (!fs.existsSync(PRODUCTS_JSON)) return [];
  return JSON.parse(fs.readFileSync(PRODUCTS_JSON, "utf8")) as Product[];
}

function readLocalCatalog(): LocalCatalog {
  if (!fs.existsSync(LOCAL_PRODUCTS_JSON)) {
    return { products: [], deletedSlugs: [] };
  }

  try {
    const raw = JSON.parse(fs.readFileSync(LOCAL_PRODUCTS_JSON, "utf8"));
    if (Array.isArray(raw)) {
      return { products: raw as Product[], deletedSlugs: [] };
    }
    return {
      products: Array.isArray(raw.products) ? (raw.products as Product[]) : [],
      deletedSlugs: Array.isArray(raw.deletedSlugs) ? (raw.deletedSlugs as string[]) : [],
    };
  } catch {
    return { products: [], deletedSlugs: [] };
  }
}

function writeLocalCatalog(local: LocalCatalog) {
  fs.mkdirSync(path.dirname(LOCAL_PRODUCTS_JSON), { recursive: true });
  fs.writeFileSync(
    LOCAL_PRODUCTS_JSON,
    JSON.stringify(
      {
        products: local.products.sort((a, b) => a.name.localeCompare(b.name)),
        deletedSlugs: [...new Set(local.deletedSlugs)].sort(),
      },
      null,
      2
    ) + "\n"
  );
}

function stableProduct(product: Product) {
  return JSON.stringify({
    id: product.id,
    name: product.name,
    slug: product.slug,
    category: product.category,
    categorySlug: product.categorySlug,
    brand: product.brand,
    price: product.price ?? null,
    mrp: product.mrp ?? null,
    inStock: product.inStock,
    description: product.description,
    specs: product.specs ?? {},
    image: product.image,
    featured: Boolean(product.featured),
    tags: product.tags ?? [],
  });
}

function loadProducts(): Product[] {
  const seed = readSeedProducts();
  const local = readLocalCatalog();
  const deleted = new Set(local.deletedSlugs);
  const bySlug = new Map<string, Product>();

  for (const product of seed) {
    if (!deleted.has(product.slug)) {
      bySlug.set(product.slug, product);
    }
  }

  for (const product of local.products) {
    if (!deleted.has(product.slug)) {
      bySlug.set(product.slug, product);
    }
  }

  return Array.from(bySlug.values()).sort((a, b) => a.name.localeCompare(b.name));
}

function saveProducts(products: Product[]) {
  const seed = readSeedProducts();
  const seedBySlug = new Map(seed.map((product) => [product.slug, product]));
  const nextSlugs = new Set(products.map((product) => product.slug));

  const deletedSlugs = seed
    .map((product) => product.slug)
    .filter((slug) => !nextSlugs.has(slug));

  const localProducts = products.filter((product) => {
    const seedProduct = seedBySlug.get(product.slug);
    return !seedProduct || stableProduct(seedProduct) !== stableProduct(product);
  });

  writeLocalCatalog({ products: localProducts, deletedSlugs });
}

/** Live catalog used by the website and admin (seed + uploaded products). */
export function loadCatalogProducts(): Product[] {
  return loadProducts();
}

export function getEditableProducts() {
  return loadProducts().map((product) => ({
    name: product.name,
    slug: product.slug,
    category: product.category,
    categorySlug: product.categorySlug,
    image: product.image,
  }));
}

export function updateProductName(
  slug: string,
  name: string,
  options: { fillSpecs?: boolean } = {}
) {
  const trimmedName = name.trim();
  if (!trimmedName) {
    throw new Error("Product name is required");
  }

  const products = loadProducts();
  const index = products.findIndex((product) => product.slug === slug);

  if (index === -1) {
    throw new Error("Product not found");
  }

  const product = products[index];
  const brand = detectBrand(trimmedName);

  let updatedProduct: Product;

  if (options.fillSpecs) {
    const lookup = lookupProductFromName(trimmedName);

    if (Object.keys(lookup.specs).length === 0) {
      throw new Error(
        "Could not detect specs from that name. Try a fuller name like \"Intel Core i5 12th Gen Processor\" or \"Samsung 990 PRO 2TB\"."
      );
    }

    updatedProduct = {
      ...product,
      name: trimmedName,
      brand: lookup.brand,
      category: lookup.category,
      categorySlug: lookup.categorySlug,
      description: lookup.description,
      specs: lookup.specs,
      tags: lookup.tags,
    };
  } else {
    updatedProduct = {
      ...product,
      name: trimmedName,
      brand,
      description: buildDescription(trimmedName, product.category),
      tags: Array.from(new Set([product.categorySlug, brand.toLowerCase(), ...(product.tags ?? [])])),
    };
  }

  products[index] = updatedProduct;
  saveProducts(products.sort((a, b) => a.name.localeCompare(b.name)));

  return {
    name: updatedProduct.name,
    slug: updatedProduct.slug,
    category: updatedProduct.category,
    categorySlug: updatedProduct.categorySlug,
    image: updatedProduct.image,
    specsFilled: Boolean(options.fillSpecs),
    specsCount: Object.keys(updatedProduct.specs ?? {}).length,
  };
}

export function deleteProduct(slug: string) {
  if (!slug.trim()) {
    throw new Error("Product is required");
  }

  const products = loadProducts();
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    throw new Error("Product not found");
  }

  const nextProducts = products.filter((item) => item.slug !== slug);
  saveProducts(nextProducts);

  if (product.image.startsWith("/images/products/")) {
    const imageName = path.basename(product.image);
    const imagePath = path.join(PRODUCTS_DIR, imageName);

    if (imagePath.startsWith(PRODUCTS_DIR) && fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  return {
    name: product.name,
    slug: product.slug,
    category: product.category,
    categorySlug: product.categorySlug,
    image: product.image,
  };
}

function nextProductId(existing: Product[]): string {
  const idNums = existing
    .map((p) => parseInt(p.id.replace(/\D/g, ""), 10))
    .filter((n) => !isNaN(n));
  return `p${(idNums.length ? Math.max(...idNums) : 0) + 1}`;
}

function buildProductFromImageFile(
  filename: string,
  existing: Product[],
  options: { categorySlug?: string; keepFilename?: boolean } = {}
): Product {
  const ext = path.extname(filename).toLowerCase() || ".png";
  const base = path.basename(filename, ext);
  const generic = isGenericFilename(filename) || /^product-\d+$/i.test(base);

  let slug: string;
  let name: string;

  if (options.keepFilename) {
    slug = slugify(base) || `product-${String(nextAutoProductNumber(existing)).padStart(3, "0")}`;
    if (/^product-\d+$/i.test(base)) {
      slug = base.toLowerCase();
      name = `Product ${parseInt(base.replace(/\D/g, ""), 10)}`;
    } else if (generic) {
      slug = `product-${String(nextAutoProductNumber(existing)).padStart(3, "0")}`;
      name = `Product ${parseInt(slug.replace(/\D/g, ""), 10)}`;
    } else {
      name = titleCaseFromFilename(filename);
    }
  } else if (generic) {
    slug = `product-${String(nextAutoProductNumber(existing)).padStart(3, "0")}`;
    name = `Product ${parseInt(slug.replace(/\D/g, ""), 10)}`;
  } else {
    slug = slugify(filename);
    name = titleCaseFromFilename(filename);
  }

  const brand = detectBrand(name);
  const category = getCategoryBySlug(options.categorySlug) ?? detectCategory(name);
  const imagePath = `/images/products/${path.basename(filename)}`;

  return {
    id: nextProductId(existing),
    name,
    slug,
    category: category.name,
    categorySlug: category.slug,
    brand,
    inStock: true,
    featured: false,
    description: buildDescription(name, category.name),
    specs: {},
    image: imagePath,
    tags: [category.slug, brand.toLowerCase()],
  };
}

export function importProductFromFile(
  filename: string,
  buffer: Buffer,
  options: { categorySlug?: string } = {}
) {
  fs.mkdirSync(PRODUCTS_DIR, { recursive: true });

  const existing = loadProducts();
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

  const product: Product = {
    id: prev?.id ?? nextProductId(existing),
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

/**
 * Re-add product photos that still exist on disk but are missing from the catalog
 * (common after git pull/reset wiped products.json changes).
 */
export function restoreProductsFromPhotos(options: { categorySlug?: string } = {}) {
  fs.mkdirSync(PRODUCTS_DIR, { recursive: true });

  const existing = loadProducts();
  const knownImages = new Set(
    existing.map((product) => path.basename(product.image).toLowerCase())
  );
  const knownSlugs = new Set(existing.map((product) => product.slug));

  const files = fs
    .readdirSync(PRODUCTS_DIR)
    .filter((file) => IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()))
    .sort((a, b) => a.localeCompare(b));

  const restored = [];
  const working = [...existing];

  for (const file of files) {
    if (knownImages.has(file.toLowerCase())) continue;

    const baseSlug = slugify(file);
    if (knownSlugs.has(baseSlug) || knownSlugs.has(file.replace(/\.[^.]+$/, "").toLowerCase())) {
      continue;
    }

    const product = buildProductFromImageFile(file, working, {
      categorySlug: options.categorySlug,
      keepFilename: true,
    });

    // Avoid slug collisions if restore invents product-00N
    if (knownSlugs.has(product.slug)) {
      product.slug = `${product.slug}-restored`;
    }

    working.push(product);
    knownSlugs.add(product.slug);
    knownImages.add(file.toLowerCase());
    restored.push({
      name: product.name,
      slug: product.slug,
      image: product.image,
      category: product.category,
      categorySlug: product.categorySlug,
    });
  }

  if (restored.length > 0) {
    saveProducts(working.sort((a, b) => a.name.localeCompare(b.name)));
  }

  return {
    restoredCount: restored.length,
    products: restored,
  };
}
