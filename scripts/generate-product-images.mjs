import sharp from "sharp";
import fs from "fs";
import path from "path";

const OUT_DIR = path.join(process.cwd(), "public/images/products");

const categoryStyles = {
  processors: {
    bg: "#EEF2FF",
    accent: "#4F46E5",
    shape: `<rect x="140" y="140" width="120" height="120" rx="8" fill="#4F46E5" opacity="0.9"/>
      <rect x="155" y="155" width="90" height="90" rx="4" fill="#818CF8"/>
      <rect x="175" y="120" width="8" height="20" rx="2" fill="#6366F1"/>
      <rect x="195" y="120" width="8" height="20" rx="2" fill="#6366F1"/>
      <rect x="215" y="120" width="8" height="20" rx="2" fill="#6366F1"/>
      <rect x="175" y="260" width="8" height="20" rx="2" fill="#6366F1"/>
      <rect x="195" y="260" width="8" height="20" rx="2" fill="#6366F1"/>
      <rect x="215" y="260" width="8" height="20" rx="2" fill="#6366F1"/>`,
  },
  "graphics-cards": {
    bg: "#ECFDF5",
    accent: "#059669",
    shape: `<rect x="80" y="180" width="240" height="80" rx="10" fill="#059669"/>
      <rect x="100" y="200" width="60" height="40" rx="4" fill="#34D399"/>
      <rect x="180" y="200" width="120" height="40" rx="4" fill="#6EE7B7"/>
      <circle cx="120" cy="280" r="12" fill="#047857"/>
      <circle cx="280" cy="280" r="12" fill="#047857"/>`,
  },
  motherboards: {
    bg: "#FFF7ED",
    accent: "#EA580C",
    shape: `<rect x="100" y="130" width="200" height="160" rx="6" fill="#EA580C"/>
      <rect x="120" y="150" width="50" height="50" rx="3" fill="#FB923C"/>
      <rect x="190" y="150" width="90" height="20" rx="3" fill="#FDBA74"/>
      <rect x="190" y="180" width="90" height="20" rx="3" fill="#FDBA74"/>
      <rect x="120" y="220" width="160" height="12" rx="2" fill="#FED7AA"/>`,
  },
  memory: {
    bg: "#FDF4FF",
    accent: "#A855F7",
    shape: `<rect x="110" y="170" width="70" height="110" rx="4" fill="#A855F7"/>
      <rect x="220" y="170" width="70" height="110" rx="4" fill="#A855F7"/>
      <rect x="120" y="185" width="50" height="12" rx="1" fill="#E9D5FF"/>
      <rect x="120" y="205" width="50" height="12" rx="1" fill="#E9D5FF"/>
      <rect x="230" y="185" width="50" height="12" rx="1" fill="#E9D5FF"/>
      <rect x="230" y="205" width="50" height="12" rx="1" fill="#E9D5FF"/>`,
  },
  storage: {
    bg: "#F0F9FF",
    accent: "#0284C7",
    shape: `<rect x="120" y="190" width="160" height="50" rx="6" fill="#0284C7"/>
      <rect x="135" y="205" width="130" height="20" rx="3" fill="#38BDF8"/>
      <rect x="175" y="255" width="50" height="8" rx="2" fill="#0EA5E9"/>`,
  },
  monitors: {
    bg: "#F0FDFA",
    accent: "#0D9488",
    shape: `<rect x="90" y="130" width="220" height="140" rx="6" fill="#0D9488"/>
      <rect x="105" y="145" width="190" height="110" rx="3" fill="#14B8A6"/>
      <rect x="165" y="280" width="70" height="30" rx="3" fill="#5EEAD4"/>
      <rect x="140" y="310" width="120" height="10" rx="4" fill="#0F766E"/>`,
  },
  "power-supply": {
    bg: "#FEF2F2",
    accent: "#DC2626",
    shape: `<rect x="110" y="160" width="180" height="120" rx="6" fill="#DC2626"/>
      <circle cx="200" cy="210" r="35" fill="#EF4444"/>
      <circle cx="200" cy="210" r="20" fill="#FCA5A5"/>`,
  },
  cabinets: {
    bg: "#F8FAFC",
    accent: "#475569",
    shape: `<rect x="130" y="110" width="140" height="200" rx="4" fill="#475569"/>
      <rect x="145" y="130" width="110" height="80" rx="2" fill="#64748B" opacity="0.6"/>
      <circle cx="165" cy="250" r="6" fill="#94A3B8"/>
      <circle cx="200" cy="250" r="6" fill="#22C55E"/>
      <circle cx="235" cy="250" r="6" fill="#94A3B8"/>`,
  },
  laptops: {
    bg: "#EFF6FF",
    accent: "#2563EB",
    shape: `<rect x="90" y="150" width="220" height="140" rx="6" fill="#2563EB"/>
      <rect x="100" y="160" width="200" height="110" rx="3" fill="#3B82F6"/>
      <path d="M70 300 L330 300 L350 320 L50 320 Z" fill="#1D4ED8"/>`,
  },
  peripherals: {
    bg: "#FAF5FF",
    accent: "#7C3AED",
    shape: `<rect x="80" y="200" width="240" height="70" rx="10" fill="#7C3AED"/>
      <rect x="100" y="215" width="40" height="40" rx="5" fill="#A78BFA"/>
      <rect x="155" y="215" width="40" height="40" rx="5" fill="#A78BFA"/>
      <rect x="210" y="215" width="40" height="40" rx="5" fill="#A78BFA"/>
      <rect x="265" y="215" width="40" height="40" rx="5" fill="#A78BFA"/>`,
  },
  networking: {
    bg: "#FFFBEB",
    accent: "#D97706",
    shape: `<rect x="100" y="180" width="200" height="70" rx="8" fill="#D97706"/>
      <circle cx="140" cy="215" r="8" fill="#22C55E"/>
      <circle cx="170" cy="215" r="8" fill="#22C55E"/>
      <circle cx="200" cy="215" r="8" fill="#FBBF24"/>
      <circle cx="230" cy="215" r="8" fill="#22C55E"/>
      <circle cx="260" cy="215" r="8" fill="#22C55E"/>`,
  },
  "prebuilt-pcs": {
    bg: "#F1F5F9",
    accent: "#1E293B",
    shape: `<rect x="120" y="120" width="160" height="180" rx="4" fill="#1E293B"/>
      <rect x="135" y="140" width="130" height="90" rx="2" fill="#334155"/>
      <rect x="155" y="250" width="90" height="30" rx="2" fill="#475569"/>`,
  },
};

const products = [
  { slug: "intel-core-i7-14700k", name: "Core i7-14700K", brand: "Intel", categorySlug: "processors" },
  { slug: "amd-ryzen-9-7900x", name: "Ryzen 9 7900X", brand: "AMD", categorySlug: "processors" },
  { slug: "nvidia-rtx-4070-super", name: "RTX 4070 Super", brand: "NVIDIA", categorySlug: "graphics-cards" },
  { slug: "amd-rx-7800-xt", name: "RX 7800 XT", brand: "AMD", categorySlug: "graphics-cards" },
  { slug: "asus-rog-strix-b650e-f", name: "ROG Strix B650E-F", brand: "ASUS", categorySlug: "motherboards" },
  { slug: "msi-mag-b760-tomahawk", name: "MAG B760 Tomahawk", brand: "MSI", categorySlug: "motherboards" },
  { slug: "corsair-vengeance-ddr5-32gb", name: "Vengeance DDR5 32GB", brand: "Corsair", categorySlug: "memory" },
  { slug: "gskill-trident-z5-64gb", name: "Trident Z5 64GB", brand: "G.Skill", categorySlug: "memory" },
  { slug: "samsung-990-pro-2tb", name: "990 Pro 2TB", brand: "Samsung", categorySlug: "ssd" },
  { slug: "wd-black-sn850x-1tb", name: "Black SN850X 1TB", brand: "WD", categorySlug: "ssd" },
  { slug: "lg-ultragear-27gp850", name: "UltraGear 27GP850", brand: "LG", categorySlug: "monitors" },
  { slug: "dell-p2723qe-27-4k", name: "P2723QE 27\" 4K", brand: "Dell", categorySlug: "monitors" },
  { slug: "corsair-rm850x-850w", name: "RM850x 850W", brand: "Corsair", categorySlug: "power-supply" },
  { slug: "cooler-master-mwe-750w", name: "MWE Gold 750W", brand: "Cooler Master", categorySlug: "power-supply" },
  { slug: "nzxt-h7-flow-rgb", name: "H7 Flow RGB", brand: "NZXT", categorySlug: "cabinets" },
  { slug: "lian-li-o11-dynamic-evo", name: "O11 Dynamic EVO", brand: "Lian Li", categorySlug: "cabinets" },
  { slug: "lenovo-thinkpad-e14-gen5", name: "ThinkPad E14 Gen 5", brand: "Lenovo", categorySlug: "laptops" },
  { slug: "asus-rog-strix-g16", name: "ROG Strix G16", brand: "ASUS", categorySlug: "laptops" },
  { slug: "logitech-g-pro-x-superlight-2", name: "G Pro X Superlight 2", brand: "Logitech", categorySlug: "peripherals" },
  { slug: "keychron-q1-pro", name: "Q1 Pro Keyboard", brand: "Keychron", categorySlug: "peripherals" },
  { slug: "tp-link-archer-ax73", name: "Archer AX73", brand: "TP-Link", categorySlug: "networking" },
  { slug: "infotoolz-gaming-pro-pc", name: "Gaming Pro PC", brand: "Infotoolz", categorySlug: "prebuilt-pcs" },
  { slug: "intel-core-i5-14400f", name: "Core i5-14400F", brand: "Intel", categorySlug: "processors" },
  { slug: "gigabyte-aorus-27-240hz", name: "AORUS 27\" 240Hz", brand: "Gigabyte", categorySlug: "monitors" },
];

function wrapText(text, maxChars) {
  const words = text.split(" ");
  const lines = [];
  let current = "";
  for (const word of words) {
    if ((current + " " + word).trim().length <= maxChars) {
      current = (current + " " + word).trim();
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 2);
}

function buildSvg(product) {
  const style = categoryStyles[product.categorySlug] ?? categoryStyles.processors;
  const nameLines = wrapText(product.name, 18);

  const nameSvg = nameLines
    .map(
      (line, i) =>
        `<text x="200" y="${355 + i * 28}" text-anchor="middle" font-family="system-ui,sans-serif" font-size="20" font-weight="700" fill="#1E293B">${escapeXml(line)}</text>`
    )
    .join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#FFFFFF"/>
        <stop offset="100%" stop-color="${style.bg}"/>
      </linearGradient>
    </defs>
    <rect width="400" height="400" fill="url(#bg)"/>
    <rect x="20" y="20" width="360" height="360" rx="16" fill="none" stroke="${style.accent}" stroke-width="1" opacity="0.15"/>
    <text x="200" y="52" text-anchor="middle" font-family="system-ui,sans-serif" font-size="14" font-weight="600" letter-spacing="2" fill="${style.accent}">${escapeXml(product.brand.toUpperCase())}</text>
    ${style.shape}
    ${nameSvg}
    <text x="200" y="395" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="#94A3B8">Infotoolz Catalog</text>
  </svg>`;
}

function escapeXml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const product of products) {
    const svg = buildSvg(product);
    const outPath = path.join(OUT_DIR, `${product.slug}.jpg`);

    await sharp(Buffer.from(svg))
      .jpeg({ quality: 90, mozjpeg: true })
      .toFile(outPath);

    console.log(`Generated ${product.slug}.jpg`);
  }

  console.log(`\nDone — ${products.length} product images saved to public/images/products/`);
}

main().catch(console.error);
