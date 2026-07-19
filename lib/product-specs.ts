export type SpecLookupResult = {
  brand: string;
  category: string;
  categorySlug: string;
  description: string;
  specs: Record<string, string>;
  tags: string[];
};

const CATEGORIES = [
  { slug: "processors", name: "Processors", keywords: ["processor", "cpu", "ryzen", "core i3", "core i5", "core i7", "core i9", "xeon"] },
  { slug: "graphics-cards", name: "Graphics Cards", keywords: ["gpu", "graphics", "geforce", "rtx", "gtx", "radeon", "rx "] },
  { slug: "motherboards", name: "Motherboards", keywords: ["motherboard", "mobo", "b650", "b760", "x670", "z790", "tomahawk", "strix b", "strix z"] },
  { slug: "memory", name: "Memory (RAM)", keywords: ["ram", "ddr4", "ddr5", "memory", "vengeance", "trident"] },
  { slug: "ssd", name: "SSD", keywords: ["ssd", "nvme", "m.2", "m2", "sata ssd", "990 pro", "sn850"] },
  { slug: "hdd", name: "HDD", keywords: ["hdd", "hard drive", "hard disk", "barracuda", "ironwolf", "wd blue", "wd red"] },
  { slug: "storage", name: "Storage", keywords: ["storage"] },
  { slug: "monitors", name: "Monitors", keywords: ["monitor", "display", "ultragear", "aorus"] },
  { slug: "power-supply", name: "Power Supply", keywords: ["psu", "power supply", "smps", "watt", "750w", "850w", "rm850", "mwe"] },
  { slug: "cabinets", name: "Cabinets", keywords: ["cabinet", "case", "chassis", "tower", "h7 flow", "o11 dynamic"] },
  { slug: "laptops", name: "Laptops", keywords: ["laptop", "notebook", "thinkpad", "vivobook", "strix g"] },
  { slug: "peripherals", name: "Peripherals", keywords: ["keyboard", "mouse", "headset", "webcam", "logitech", "keychron"] },
  { slug: "switches", name: "Switches", keywords: ["switch", "poe switch", "managed switch", "unmanaged switch", "gigabit switch"] },
  { slug: "servers", name: "Servers", keywords: ["server", "rack server", "tower server", "poweredge", "proliant", "thinksystem"] },
  { slug: "networking", name: "Networking", keywords: ["router", "wifi", "tp-link", "archer", "access point", "network adapter"] },
  { slug: "prebuilt-pcs", name: "Pre-built PCs", keywords: ["desktop pc", "prebuilt", "gaming pc", "gaming pro pc"] },
];

const BRANDS = [
  "Western Digital",
  "Cooler Master",
  "G.Skill",
  "TP-Link",
  "Lian Li",
  "Keychron",
  "Infotoolz",
  "Kingston",
  "Seagate",
  "Gigabyte",
  "Corsair",
  "Logitech",
  "Samsung",
  "Crucial",
  "NVIDIA",
  "Intel",
  "AMD",
  "ASUS",
  "MSI",
  "Dell",
  "Lenovo",
  "Cisco",
  "HPE",
  "NZXT",
  "BenQ",
  "Apple",
  "Acer",
  "LG",
  "HP",
  "WD",
];

/** Known models keyed by normalized name fragments (longest match wins). */
const KNOWN_SPECS: Array<{
  match: RegExp;
  brand?: string;
  categorySlug?: string;
  description: string;
  specs: Record<string, string>;
  tags?: string[];
}> = [
  {
    match: /ryzen\s*9\s*7900x/i,
    brand: "AMD",
    categorySlug: "processors",
    description: "12-core, 24-thread processor built on AMD Zen 4 architecture for exceptional multi-threaded performance.",
    specs: {
      Cores: "12",
      Threads: "24",
      "Base Clock": "4.7 GHz",
      "Boost Clock": "5.6 GHz",
      Socket: "AM5",
      TDP: "170W",
    },
    tags: ["gaming", "amd", "zen4"],
  },
  {
    match: /core\s*i7[-\s]?14700k/i,
    brand: "Intel",
    categorySlug: "processors",
    description: "20-core unlocked desktop CPU with high boost clocks for gaming and content creation.",
    specs: {
      Cores: "20 (8P + 12E)",
      "Base Clock": "3.4 GHz",
      "Boost Clock": "5.6 GHz",
      Socket: "LGA 1700",
      TDP: "125W",
    },
    tags: ["gaming", "intel", "unlocked"],
  },
  {
    match: /core\s*i5[-\s]?14400f/i,
    brand: "Intel",
    categorySlug: "processors",
    description: "Efficient 14th Gen desktop processor for mainstream gaming and productivity builds.",
    specs: {
      Cores: "10 (6P + 4E)",
      "Base Clock": "2.5 GHz",
      "Boost Clock": "4.7 GHz",
      Socket: "LGA 1700",
      TDP: "65W",
    },
    tags: ["intel", "value"],
  },
  {
    match: /rtx\s*4070\s*super/i,
    brand: "NVIDIA",
    categorySlug: "graphics-cards",
    description: "Ada Lovelace GPU with 12GB GDDR6X for strong 1440p gaming performance.",
    specs: {
      Memory: "12GB GDDR6X",
      "CUDA Cores": "7168",
      "Boost Clock": "2475 MHz",
      Interface: "PCIe 4.0 x16",
      TDP: "220W",
    },
    tags: ["gaming", "nvidia", "ada"],
  },
  {
    match: /rx\s*7800\s*xt/i,
    brand: "AMD",
    categorySlug: "graphics-cards",
    description: "RDNA 3 architecture GPU with 16GB GDDR6. Excellent 1440p gaming performance.",
    specs: {
      Memory: "16GB GDDR6",
      "Stream Processors": "3840",
      "Game Clock": "2124 MHz",
      Interface: "PCIe 4.0 x16",
      TDP: "263W",
    },
    tags: ["gaming", "amd", "rdna3"],
  },
  {
    match: /rtx\s*4060/i,
    brand: "NVIDIA",
    categorySlug: "graphics-cards",
    description: "Efficient Ada Lovelace GPU for 1080p and entry 1440p gaming.",
    specs: {
      Memory: "8GB GDDR6",
      Interface: "PCIe 4.0 x8",
      TDP: "115W",
    },
    tags: ["gaming", "nvidia"],
  },
  {
    match: /rtx\s*4070(?!\s*super)/i,
    brand: "NVIDIA",
    categorySlug: "graphics-cards",
    description: "1440p gaming GPU with DLSS 3 and 12GB GDDR6X memory.",
    specs: {
      Memory: "12GB GDDR6X",
      Interface: "PCIe 4.0 x16",
      TDP: "200W",
    },
    tags: ["gaming", "nvidia"],
  },
  {
    match: /990\s*pro/i,
    brand: "Samsung",
    categorySlug: "ssd",
    description: "High-speed PCIe 4.0 NVMe SSD for gaming and creative workloads.",
    specs: {
      Interface: "PCIe 4.0 x4 NVMe",
      "Read Speed": "7,450 MB/s",
      "Write Speed": "6,900 MB/s",
      Form: "M.2 2280",
    },
    tags: ["nvme", "ssd", "samsung"],
  },
  {
    match: /sn850x?/i,
    brand: "Western Digital",
    categorySlug: "ssd",
    description: "WD Black SN850X PCIe 4.0 NVMe SSD built for high-performance gaming PCs.",
    specs: {
      Interface: "PCIe 4.0 x4 NVMe",
      "Read Speed": "7,300 MB/s",
      "Write Speed": "6,300 MB/s",
      Form: "M.2 2280",
    },
    tags: ["nvme", "ssd", "wd"],
  },
  {
    match: /b650e?-?f|strix\s*b650/i,
    brand: "ASUS",
    categorySlug: "motherboards",
    description: "Premium AM5 motherboard with PCIe 5.0, WiFi 6E, and robust VRM for overclocking.",
    specs: {
      Socket: "AM5",
      Chipset: "AMD B650E",
      "Form Factor": "ATX",
      Memory: "DDR5, 4 slots, up to 128GB",
      "PCIe Slots": "1x PCIe 5.0 x16",
    },
    tags: ["gaming", "asus", "am5"],
  },
  {
    match: /b760\s*tomahawk/i,
    brand: "MSI",
    categorySlug: "motherboards",
    description: "Solid Intel B760 ATX board with strong power delivery and DDR5 support.",
    specs: {
      Socket: "LGA 1700",
      Chipset: "Intel B760",
      "Form Factor": "ATX",
      Memory: "DDR5, 4 slots, up to 192GB",
      "PCIe Slots": "1x PCIe 5.0 x16",
    },
    tags: ["msi", "intel"],
  },
  {
    match: /rm850x?/i,
    brand: "Corsair",
    categorySlug: "power-supply",
    description: "Fully modular 850W power supply with 80+ Gold efficiency and quiet operation.",
    specs: {
      Wattage: "850W",
      Efficiency: "80+ Gold",
      Modular: "Fully Modular",
      Fan: "135mm Rifle Bearing",
      Warranty: "10 Years",
    },
    tags: ["modular", "gold"],
  },
  {
    match: /mwe\s*gold\s*750/i,
    brand: "Cooler Master",
    categorySlug: "power-supply",
    description: "Reliable 750W PSU with 80+ Gold certification for mid-range gaming builds.",
    specs: {
      Wattage: "750W",
      Efficiency: "80+ Gold",
      Modular: "Semi-Modular",
      Fan: "120mm HDB",
      Warranty: "5 Years",
    },
    tags: ["budget", "gold"],
  },
  {
    match: /ultragear|27gp850/i,
    brand: "LG",
    categorySlug: "monitors",
    description: "Fast IPS gaming monitor with high refresh rate for competitive play.",
    specs: {
      Size: "27 inch",
      Resolution: "2560 x 1440 (QHD)",
      "Refresh Rate": "165Hz",
      Panel: "Nano IPS",
      Response: "1ms GtG",
    },
    tags: ["gaming", "qhd"],
  },
  {
    match: /thinkpad\s*e14/i,
    brand: "Lenovo",
    categorySlug: "laptops",
    description: "Business laptop with solid build quality for everyday productivity.",
    specs: {
      Processor: "Intel Core i5",
      RAM: "16GB",
      Storage: "512GB SSD",
      Display: '14" FHD IPS',
      OS: "Windows 11 Pro",
    },
    tags: ["business", "lenovo"],
  },
  {
    match: /strix\s*g16/i,
    brand: "ASUS",
    categorySlug: "laptops",
    description: "Gaming laptop with dedicated GeForce GPU and high-refresh display.",
    specs: {
      Processor: "Intel Core i7",
      GPU: "NVIDIA RTX 4060 8GB",
      RAM: "16GB DDR5",
      Storage: "1TB SSD",
      Display: '16" FHD 165Hz',
    },
    tags: ["gaming", "rog"],
  },
  {
    match: /keychron\s*q1/i,
    brand: "Keychron",
    categorySlug: "peripherals",
    description: "Premium custom mechanical keyboard with hot-swappable switches.",
    specs: {
      Layout: "75%",
      Switches: "Gateron Pro (Hot-swappable)",
      Connectivity: "Bluetooth, 2.4GHz, USB-C",
      Battery: "Up to 100 hours",
      Material: "Aluminum",
    },
    tags: ["mechanical", "keyboard"],
  },
  {
    match: /g\s*pro\s*x\s*superlight/i,
    brand: "Logitech",
    categorySlug: "peripherals",
    description: "Ultra-light wireless gaming mouse for competitive esports.",
    specs: {
      Sensor: "HERO 2",
      DPI: "Up to 32,000",
      Weight: "60g",
      Connectivity: "LIGHTSPEED Wireless",
      Battery: "Up to 95 hours",
    },
    tags: ["esports", "mouse"],
  },
  {
    match: /archer\s*ax73/i,
    brand: "TP-Link",
    categorySlug: "networking",
    description: "WiFi 6 dual-band router for fast home and office networking.",
    specs: {
      Standard: "WiFi 6 (802.11ax)",
      Speed: "5400 Mbps",
      Bands: "2.4GHz + 5GHz",
      Ports: "4x Gigabit LAN, 1x WAN",
      Coverage: "Up to 2000 sq ft",
    },
    tags: ["wifi6", "router"],
  },
  {
    match: /tl-sg108|sg108|8[-\s]?port.*switch|gigabit.*switch/i,
    brand: "TP-Link",
    categorySlug: "switches",
    description: "Compact gigabit network switch for offices, labs, and small business setups.",
    specs: {
      Ports: "8x Gigabit RJ45",
      Type: "Unmanaged",
      Speed: "10/100/1000 Mbps",
      Form: "Desktop",
      PoE: "No",
    },
    tags: ["switch", "gigabit"],
  },
  {
    match: /poweredge\s*t350|t350\s*server/i,
    brand: "Dell",
    categorySlug: "servers",
    description: "Tower server built for growing businesses, branch offices, and light virtualization.",
    specs: {
      Form: "Tower",
      Processor: "Intel Xeon E-2300 series",
      "Memory Support": "Up to 128GB DDR4",
      Storage: "Up to 8x 3.5\" drives",
      "Use Case": "SMB / branch office",
    },
    tags: ["server", "dell", "xeon"],
  },
  {
    match: /h7\s*flow/i,
    brand: "NZXT",
    categorySlug: "cabinets",
    description: "High-airflow mid-tower case with clean cable management and RGB options.",
    specs: {
      "Form Factor": "Mid-Tower ATX",
      "Motherboard Support": "ATX, mATX, ITX",
      "Max GPU Length": "400mm",
      "Drive Bays": '2x 3.5", 2x 2.5"',
      Fans: "3x 120mm RGB included",
    },
    tags: ["case", "rgb"],
  },
  {
    match: /o11\s*dynamic/i,
    brand: "Lian Li",
    categorySlug: "cabinets",
    description: "Showcase mid-tower case with excellent cooling support and tempered glass panels.",
    specs: {
      "Form Factor": "Mid-Tower ATX",
      "Motherboard Support": "ATX, mATX, ITX",
      "Max GPU Length": "420mm",
      Panels: "Tempered Glass",
      Fans: "Up to 10x 120mm",
    },
    tags: ["case", "showcase"],
  },
];

const INTEL_GEN: Record<string, { name: string; socket: string }> = {
  "10": { name: "10th Gen (Comet Lake)", socket: "LGA 1200" },
  "11": { name: "11th Gen (Rocket Lake)", socket: "LGA 1200" },
  "12": { name: "12th Gen (Alder Lake)", socket: "LGA 1700" },
  "13": { name: "13th Gen (Raptor Lake)", socket: "LGA 1700" },
  "14": { name: "14th Gen (Raptor Lake Refresh)", socket: "LGA 1700" },
};

function detectBrand(name: string): string {
  const lower = name.toLowerCase();
  for (const brand of BRANDS) {
    if (lower.includes(brand.toLowerCase())) return brand === "WD" ? "Western Digital" : brand;
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

function categoryBySlug(slug: string) {
  return CATEGORIES.find((cat) => cat.slug === slug) ?? { slug: "peripherals", name: "Peripherals" };
}

function buildFallbackDescription(name: string, category: string): string {
  return `Genuine ${name} — available from Infotoolz. Contact us for availability, bulk orders, and expert advice. Category: ${category}.`;
}

function extractCapacity(name: string): string | null {
  const match = name.match(/(\d+(?:\.\d+)?)\s*(TB|GB|tb|gb)\b/);
  if (!match) return null;
  return `${match[1]}${match[2].toUpperCase()}`;
}

function extractKitCapacity(name: string): string | null {
  const kit = name.match(/(\d+)\s*GB\s*\(\s*(\d+)\s*x\s*(\d+)\s*GB\s*\)/i);
  if (kit) return `${kit[1]}GB (${kit[2]}x${kit[3]}GB)`;
  const total = name.match(/(\d+)\s*GB\b/i);
  return total ? `${total[1]}GB` : null;
}

function extractSpeedMHz(name: string): string | null {
  const match = name.match(/(\d{3,5})\s*MHz/i);
  return match ? `${match[1]}MHz` : null;
}

function extractWattage(name: string): string | null {
  const match = name.match(/(\d{3,4})\s*W\b/i);
  return match ? `${match[1]}W` : null;
}

function extractInch(name: string): string | null {
  const match = name.match(/(\d{2}(?:\.\d)?)\s*(?:\"|inch|in)\b/i);
  return match ? `${match[1]} inch` : null;
}

function extractRefresh(name: string): string | null {
  const match = name.match(/(\d{2,3})\s*Hz/i);
  return match ? `${match[1]}Hz` : null;
}

function heuristicSpecs(name: string, categorySlug: string): Record<string, string> {
  const lower = name.toLowerCase();
  const specs: Record<string, string> = {};

  if (categorySlug === "processors") {
    const intelGen = lower.match(/(\d{1,2})(?:th|st|nd|rd)\s*gen/);
    const series = lower.match(/core\s*(i[3579])/i) || lower.match(/ryzen\s*([3579])/i);

    if (intelGen && INTEL_GEN[intelGen[1]]) {
      const gen = INTEL_GEN[intelGen[1]];
      specs.Generation = gen.name;
      specs.Socket = gen.socket;
      specs.Segment = "Desktop";
      if (lower.includes("unlocked") || /\bk\b/.test(lower)) {
        specs.Type = "Unlocked";
      } else if (lower.includes("f ") || /f\b/.test(lower.split(/\s+/).pop() || "")) {
        specs.Graphics = "Discrete GPU required";
      } else {
        specs.Graphics = lower.includes("f") && /i[3579].*f|f\s*processor|processor.*\bf\b/.test(lower)
          ? "Discrete GPU required"
          : "Integrated / check model";
      }
    } else if (series) {
      if (lower.includes("ryzen")) {
        specs.Socket = /7\d{3}|9\d{3}|8\d{3}/.test(lower) ? "AM5" : "AM4";
        specs.Architecture = /7\d{3}|8\d{3}|9\d{3}/.test(lower) ? "Zen 4 / Zen 5 family" : "Zen 3 / earlier";
      } else {
        specs.Segment = "Desktop";
      }
      if (lower.includes("unlocked") || /\bk\b/.test(name)) specs.Type = "Unlocked";
    }

    return specs;
  }

  if (categorySlug === "graphics-cards") {
    const mem = extractCapacity(name);
    if (mem) specs.Memory = mem.includes("GB") ? `${mem} GDDR6` : mem;
    if (/rtx|gtx|geforce/i.test(name)) specs.Interface = "PCIe 4.0 x16";
    if (/rx\s*\d/i.test(name)) specs.Interface = "PCIe 4.0 x16";
    return specs;
  }

  if (categorySlug === "memory") {
    const capacity = extractKitCapacity(name);
    const speed = extractSpeedMHz(name);
    if (capacity) specs.Capacity = capacity;
    if (speed) specs.Speed = speed;
    if (/ddr5/i.test(name)) specs.Type = "DDR5";
    else if (/ddr4/i.test(name)) specs.Type = "DDR4";
    return specs;
  }

  if (categorySlug === "ssd" || categorySlug === "hdd" || categorySlug === "storage") {
    const capacity = extractCapacity(name);
    if (capacity) specs.Capacity = capacity;
    if (categorySlug === "ssd" || /nvme|m\.?2|990|sn850/i.test(name)) {
      specs.Interface = /sata/i.test(name) ? "SATA III" : "PCIe 4.0 x4 NVMe";
      specs.Form = /2\.5/.test(name) ? '2.5"' : "M.2 2280";
    } else if (categorySlug === "hdd") {
      specs.Interface = "SATA III";
      specs.Form = /2\.5/.test(name) ? '2.5"' : '3.5"';
      specs.Type = "HDD";
    }
    return specs;
  }

  if (categorySlug === "power-supply") {
    const wattage = extractWattage(name);
    if (wattage) specs.Wattage = wattage;
    if (/80\+?\s*gold|gold/i.test(name)) specs.Efficiency = "80+ Gold";
    else if (/80\+?\s*bronze|bronze/i.test(name)) specs.Efficiency = "80+ Bronze";
    else if (/80\+?\s*platinum|platinum/i.test(name)) specs.Efficiency = "80+ Platinum";
    if (/fully\s*modular|modular/i.test(name)) {
      specs.Modular = /semi/i.test(name) ? "Semi-Modular" : "Fully Modular";
    }
    return specs;
  }

  if (categorySlug === "monitors") {
    const size = extractInch(name);
    const refresh = extractRefresh(name);
    if (size) specs.Size = size;
    if (refresh) specs["Refresh Rate"] = refresh;
    if (/4k|uhd|3840/i.test(name)) specs.Resolution = "3840 x 2160 (4K)";
    else if (/qhd|1440|2k/i.test(name)) specs.Resolution = "2560 x 1440 (QHD)";
    else if (/fhd|1080/i.test(name)) specs.Resolution = "1920 x 1080 (FHD)";
    if (/ips/i.test(name)) specs.Panel = "IPS";
    else if (/va/i.test(name)) specs.Panel = "VA";
    else if (/oled/i.test(name)) specs.Panel = "OLED";
    return specs;
  }

  if (categorySlug === "motherboards") {
    if (/am5|b650|x670|x870/i.test(name)) specs.Socket = "AM5";
    else if (/am4|b550|x570/i.test(name)) specs.Socket = "AM4";
    else if (/lga\s*1700|b760|z790|b660|h610/i.test(name)) specs.Socket = "LGA 1700";
    else if (/lga\s*1200|b560|z590/i.test(name)) specs.Socket = "LGA 1200";

    const chipset = name.match(/\b([BHXZ]\d{3}[A-Z]?)\b/i);
    if (chipset) specs.Chipset = chipset[1].toUpperCase();
    if (/atx/i.test(name) && !/matx|micro/i.test(name)) specs["Form Factor"] = "ATX";
    else if (/m-?atx|micro/i.test(name)) specs["Form Factor"] = "mATX";
    else if (/itx|mini/i.test(name)) specs["Form Factor"] = "ITX";
    if (/ddr5/i.test(name)) specs.Memory = "DDR5";
    else if (/ddr4/i.test(name)) specs.Memory = "DDR4";
    return specs;
  }

  if (categorySlug === "laptops") {
    const ram = name.match(/(\d+)\s*GB\s*(?:DDR\d|RAM)?/i);
    const storage = extractCapacity(name);
    if (ram) specs.RAM = `${ram[1]}GB`;
    if (storage && /ssd|tb|nvme/i.test(name)) specs.Storage = storage.includes("TB") || storage.includes("GB") ? `${storage} SSD` : storage;
    const display = extractInch(name);
    if (display) specs.Display = display.replace(" inch", '"');
    return specs;
  }

  if (categorySlug === "networking") {
    if (/wifi\s*6e|axe/i.test(name)) specs.Standard = "WiFi 6E";
    else if (/wifi\s*6|ax\d/i.test(name)) specs.Standard = "WiFi 6 (802.11ax)";
    else if (/wifi\s*7|be\d/i.test(name)) specs.Standard = "WiFi 7";
    return specs;
  }

  if (categorySlug === "switches") {
    const ports = name.match(/(\d{1,2})\s*[-\s]?port/i);
    if (ports) specs.Ports = `${ports[1]}x Ethernet`;
    if (/poe/i.test(name)) specs.PoE = "Yes";
    if (/managed/i.test(name) && !/unmanaged/i.test(name)) specs.Type = "Managed";
    else if (/unmanaged/i.test(name)) specs.Type = "Unmanaged";
    if (/gigabit|1g|1000/i.test(name)) specs.Speed = "10/100/1000 Mbps";
    else if (/2\.5g/i.test(name)) specs.Speed = "2.5 Gbps";
    else if (/10g/i.test(name)) specs.Speed = "10 Gbps";
    return specs;
  }

  if (categorySlug === "servers") {
    if (/rack|1u|2u/i.test(name)) specs.Form = /2u/i.test(name) ? "2U Rack" : "1U Rack";
    else if (/tower/i.test(name)) specs.Form = "Tower";
    if (/xeon/i.test(name)) specs.Processor = "Intel Xeon";
    else if (/epyc/i.test(name)) specs.Processor = "AMD EPYC";
    if (/ddr5/i.test(name)) specs.Memory = "DDR5";
    else if (/ddr4/i.test(name)) specs.Memory = "DDR4";
    return specs;
  }

  return specs;
}

function buildTags(name: string, brand: string, categorySlug: string, extra: string[] = []): string[] {
  const tags = new Set<string>([categorySlug, brand.toLowerCase(), ...extra]);
  const lower = name.toLowerCase();

  if (/gaming|rog|aorus|strix|tuf/.test(lower)) tags.add("gaming");
  if (/ddr5/.test(lower)) tags.add("ddr5");
  if (/nvme|m\.?2/.test(lower)) tags.add("nvme");
  if (/rgb/.test(lower)) tags.add("rgb");
  if (/wifi/.test(lower)) tags.add("wifi");
  if (/(\d{1,2})(?:th|st|nd|rd)\s*gen/.test(lower)) {
    const gen = lower.match(/(\d{1,2})(?:th|st|nd|rd)\s*gen/);
    if (gen) tags.add(gen[1] + (gen[1] === "1" ? "st" : gen[1] === "2" ? "nd" : gen[1] === "3" ? "rd" : "th"));
  }

  return Array.from(tags).filter(Boolean);
}

/**
 * Derive brand, category, description, and specs from a product display name.
 * Uses known-model matches first, then category heuristics from the name text.
 */
export function lookupProductFromName(name: string): SpecLookupResult {
  const trimmed = name.trim();
  const brand = detectBrand(trimmed);
  let category = detectCategory(trimmed);
  let description = buildFallbackDescription(trimmed, category.name);
  let specs: Record<string, string> = {};
  let tags: string[] = [];

  const known = KNOWN_SPECS.find((entry) => entry.match.test(trimmed));
  if (known) {
    if (known.categorySlug) category = categoryBySlug(known.categorySlug);
    description = known.description;
    specs = { ...known.specs };
    tags = known.tags ?? [];

    // Fill capacity from name when known model omits it (e.g. 990 PRO 2TB).
    const capacity = extractCapacity(trimmed);
    if (capacity && !specs.Capacity && (category.slug === "ssd" || category.slug === "hdd" || category.slug === "memory")) {
      specs = { Capacity: capacity, ...specs };
    }
  } else {
    specs = heuristicSpecs(trimmed, category.slug);
    if (Object.keys(specs).length > 0) {
      description = `${trimmed} — key specs auto-filled from the product name. Contact Infotoolz for availability and bulk orders.`;
    }
  }

  // Always prefer brand from known entry when present.
  const finalBrand = known?.brand ?? brand;

  return {
    brand: finalBrand,
    category: category.name,
    categorySlug: category.slug,
    description,
    specs,
    tags: buildTags(trimmed, finalBrand, category.slug, tags),
  };
}
