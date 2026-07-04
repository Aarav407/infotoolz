import sharp from "sharp";
import fs from "fs";
import path from "path";

const OUT = path.join(process.cwd(), "public/images/products");

const items = [
  {
    slug: "intel-core-i9-14th-gen-unlocked",
    brand: "INTEL",
    title: "Core i9",
    subtitle: "14th Gen · Unlocked",
    bg: "#0c1e4a",
    accent: "#c0c8d8",
    badge: "i9",
  },
  {
    slug: "intel-core-i7-12th-gen-unlocked",
    brand: "INTEL",
    title: "Core i7",
    subtitle: "12th Gen · Unlocked",
    bg: "#1e4a8c",
    accent: "#7ec8e8",
    badge: "i7",
  },
  {
    slug: "intel-core-i7-12th-gen",
    brand: "INTEL",
    title: "Core i7",
    subtitle: "12th Gen",
    bg: "#1a3f7a",
    accent: "#5eb8e0",
    badge: "i7",
    note: "Discrete GPU required",
  },
  {
    slug: "intel-core-i5-12th-gen",
    brand: "INTEL",
    title: "Core i5",
    subtitle: "12th Gen",
    bg: "#1a4a8a",
    accent: "#6ec0e8",
    badge: "i5",
    note: "Discrete GPU required",
  },
  {
    slug: "intel-core-i3-12th-gen",
    brand: "INTEL",
    title: "Core i3",
    subtitle: "12th Gen",
    bg: "#1a4585",
    accent: "#68b8e0",
    badge: "i3",
    note: "Discrete GPU required",
  },
  {
    slug: "intel-core-i5-10th-gen",
    brand: "INTEL",
    title: "Core i5",
    subtitle: "10th Gen",
    bg: "#0f2d5c",
    accent: "#8aa8c8",
    badge: "i5",
    note: "Discrete GPU required",
  },
  {
    slug: "intel-core-i3-10th-gen",
    brand: "INTEL",
    title: "Core i3",
    subtitle: "10th Gen",
    bg: "#0f2d5c",
    accent: "#8aa8c8",
    badge: "i3",
    note: "Discrete GPU required",
  },
];

function svg(item) {
  const note = item.note
    ? `<text x="200" y="370" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12" fill="#94a3b8">${item.note}</text>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <rect width="400" height="400" fill="#f8fafc"/>
    <rect x="40" y="40" width="320" height="320" rx="12" fill="${item.bg}"/>
    <rect x="60" y="60" width="120" height="80" rx="4" fill="${item.accent}" opacity="0.25"/>
    <rect x="220" y="60" width="120" height="200" rx="4" fill="${item.accent}" opacity="0.15"/>
    <text x="200" y="100" text-anchor="middle" font-family="system-ui,sans-serif" font-size="16" font-weight="600" letter-spacing="3" fill="white">${item.brand}</text>
    <text x="200" y="200" text-anchor="middle" font-family="system-ui,sans-serif" font-size="48" font-weight="800" fill="white">${item.title}</text>
    <text x="200" y="240" text-anchor="middle" font-family="system-ui,sans-serif" font-size="16" fill="${item.accent}">${item.subtitle}</text>
    <rect x="300" y="70" width="50" height="50" rx="6" fill="${item.accent}" opacity="0.9"/>
    <text x="325" y="102" text-anchor="middle" font-family="system-ui,sans-serif" font-size="22" font-weight="700" fill="${item.bg}">${item.badge}</text>
    ${note}
    <text x="200" y="390" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="#64748b">Infotoolz</text>
  </svg>`;
}

fs.mkdirSync(OUT, { recursive: true });

for (const item of items) {
  const out = path.join(OUT, `${item.slug}.png`);
  await sharp(Buffer.from(svg(item))).png().toFile(out);
  console.log("Generated", item.slug);
}
