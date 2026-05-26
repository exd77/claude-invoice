/* ============================================================
 * billing-generator.ts — Port of billing-generating/js/data.js
 * + generator.js, adapted for claude-invoice.
 * Supports US, GB (UK), CN (China).
 * All data is synthetic / fictional.
 * ============================================================ */

export interface GeneratedAddress {
  country: "US" | "CN" | "UK";
  countryName: string;
  name: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  region: string;
  postalCode: string;
}

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const rand = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const fillPattern = (pattern: string): string => {
  const digits = "0123456789";
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return pattern
    .split("")
    .map((ch) => {
      if (ch === "#") return digits[rand(0, 9)];
      if (ch === "@") return letters[rand(0, 25)];
      return ch;
    })
    .join("");
};

// ── Names ──────────────────────────────────────────────────

const FIRST_NAMES: Record<string, string[]> = {
  US: ["James","Mary","John","Patricia","Robert","Jennifer","Michael","Linda","William","Elizabeth","David","Barbara","Richard","Susan","Joseph","Jessica","Thomas","Sarah","Charles","Karen"],
  UK: ["Oliver","Amelia","Harry","Olivia","George","Isla","Noah","Ava","Jack","Emily","Leo","Sophia","Oscar","Grace","Charlie","Mia","Arthur","Poppy","Henry","Lily"],
  CN: ["Wei","Min","Fang","Liang","Jun","Tao","Yan","Lei","Ming","Hui","Xin","Jie","Hao","Xia","Yong","Hua","Lan","Ping","Hong","Qiang"],
};

const LAST_NAMES: Record<string, string[]> = {
  US: ["Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Rodriguez","Martinez","Hernandez","Lopez","Gonzalez","Wilson","Anderson","Thomas","Taylor","Moore","Jackson","Martin"],
  UK: ["Smith","Jones","Taylor","Brown","Williams","Wilson","Johnson","Davies","Robinson","Wright","Thompson","Evans","Walker","White","Roberts","Green","Hall","Wood","Jackson","Clarke"],
  CN: ["Wang","Li","Zhang","Liu","Chen","Yang","Huang","Zhao","Wu","Zhou","Xu","Sun","Ma","Zhu","Hu","Guo","Lin","He","Gao","Luo"],
};

// ── Street data ────────────────────────────────────────────

const STREET_NAMES: Record<string, string[]> = {
  US: ["Main","Oak","Pine","Maple","Cedar","Elm","Washington","Lake","Hill","Park","Sunset","River","Lincoln","Jefferson","Madison","Spring","Church","Highland","Forest","Meadow"],
  UK: ["High","Church","Mill","Victoria","Albert","Station","Park","King's","Queen's","York","London","Manor","School","New","Old","West","East","North","South","Green"],
  CN: ["Jiefang","Renmin","Zhongshan","Nanjing","Chang'an","Xi'an","Haidian","Zhongguancun","Wangfujing","Xidan","Dongcheng","Xicheng","Chaoyang","Pudong","Zijing"],
};

const STREET_TYPES: Record<string, string[]> = {
  US: ["St","Ave","Blvd","Rd","Dr","Ln","Way","Ct","Pl","Ter"],
  UK: ["Street","Road","Lane","Avenue","Close","Drive","Way","Place","Court","Mews"],
  CN: [""], // Chinese streets don't use suffixes the same way
};

// ── Regions + Cities ───────────────────────────────────────

type RegionEntry = [string, string, string[]]; // [regionName, code, cities]

const REGIONS: Record<string, RegionEntry[]> = {
  US: [
    ["California","CA",["Los Angeles","San Francisco","San Diego","Sacramento","San Jose","Oakland","Fresno","Long Beach"]],
    ["New York","NY",["New York","Buffalo","Rochester","Albany","Syracuse","Yonkers"]],
    ["Texas","TX",["Houston","Austin","Dallas","San Antonio","Fort Worth","El Paso"]],
    ["Florida","FL",["Miami","Orlando","Tampa","Jacksonville","Tallahassee","Fort Lauderdale"]],
    ["Illinois","IL",["Chicago","Springfield","Peoria","Rockford","Naperville"]],
    ["Washington","WA",["Seattle","Spokane","Tacoma","Olympia","Bellevue"]],
    ["Massachusetts","MA",["Boston","Cambridge","Worcester","Springfield","Lowell"]],
    ["Colorado","CO",["Denver","Boulder","Colorado Springs","Aurora","Fort Collins"]],
  ],
  UK: [
    ["England","ENG",["London","Manchester","Birmingham","Liverpool","Leeds","Bristol","Sheffield","Newcastle"]],
    ["Scotland","SCT",["Edinburgh","Glasgow","Aberdeen","Dundee","Stirling","Inverness"]],
    ["Wales","WLS",["Cardiff","Swansea","Newport","Wrexham","Bangor"]],
    ["Northern Ireland","NIR",["Belfast","Derry","Lisburn","Newry","Armagh"]],
  ],
  CN: [
    ["Beijing","BJ",["Beijing"]],
    ["Shanghai","SH",["Shanghai"]],
    ["Guangdong","GD",["Guangzhou","Shenzhen","Dongguan","Foshan","Zhuhai"]],
    ["Zhejiang","ZJ",["Hangzhou","Ningbo","Wenzhou","Shaoxing","Jiaxing"]],
    ["Jiangsu","JS",["Nanjing","Suzhou","Wuxi","Changzhou","Xuzhou"]],
    ["Sichuan","SC",["Chengdu","Mianyang","Deyang","Yibin","Luzhou"]],
    ["Hubei","HB",["Wuhan","Yichang","Xiangyang","Jingzhou","Huangshi"]],
    ["Fujian","FJ",["Fuzhou","Xiamen","Quanzhou","Zhangzhou","Longyan"]],
  ],
};

// ── Postal patterns ────────────────────────────────────────

const COUNTRIES: Record<string, { name: string; postalPattern: string }> = {
  US: { name: "United States", postalPattern: "#####" },
  UK: { name: "United Kingdom", postalPattern: "@#@ #@@" },
  CN: { name: "China", postalPattern: "######" },
};

// ── Secondary line generators ──────────────────────────────

const SECONDARY_LINES: Record<string, string[]> = {
  US: ["Apt", "Suite", "Unit", "#"],
  UK: ["Flat", "Apartment", "Suite", "#"],
  CN: ["Room", "Floor", "Building", "#"],
};

// ── Build functions ────────────────────────────────────────

function buildName(country: string): string {
  const first = pick(FIRST_NAMES[country]);
  const last = pick(LAST_NAMES[country]);
  // Chinese: surname first
  if (country === "CN") return `${last}${first}`;
  return `${first} ${last}`;
}

function buildStreetLine(country: string): string {
  const street = pick(STREET_NAMES[country]);
  const types = STREET_TYPES[country];
  const type = types.length ? pick(types) : "";
  const number = rand(1, 9999);

  if (country === "CN") {
    // Chinese: No. {number} {street} Street / Road
    const suffix = pick(["Street", "Road", "Avenue", "Lane", "Road"]);
    return `${street} ${suffix} No. ${number}`;
  }
  if (country === "UK") return `${number} ${street} ${type}`;
  return `${number} ${street} ${type}`;
}

function buildSecondaryLine(country: string): string {
  if (Math.random() > 0.55) return "";
  const types = SECONDARY_LINES[country];
  const t = pick(types);
  const num = rand(1, 50);
  if (t === "#") return `#${num}`;
  return `${t} ${num}`;
}

function buildRegionCity(country: string): { region: string; regionCode: string; city: string } {
  const list = REGIONS[country];
  const [regionName, regionCode, cities] = pick(list);
  const city = pick(cities);
  return { region: regionName, regionCode, city };
}

function buildPostal(country: string): string {
  return fillPattern(COUNTRIES[country].postalPattern);
}

// ── VAT / Tax ID patterns ──────────────────────────────────

const VAT_PATTERNS: Record<string, { label: string; pattern: string }> = {
  US: { label: "EIN", pattern: "##-#######" },
  UK: { label: "VAT", pattern: "GB### #### ##" },
  CN: { label: "Tax ID", pattern: "###################" },  // unified social credit code = 18 chars
};

export function generateVatId(country: "US" | "CN" | "UK"): string {
  const cfg = VAT_PATTERNS[country];
  return `${cfg.label} ${fillPattern(cfg.pattern)}`;
}

// ── Main generate function ─────────────────────────────────

export function generateAddress(country: "US" | "CN" | "UK"): GeneratedAddress {
  const { region, city } = buildRegionCity(country);

  return {
    country,
    countryName: COUNTRIES[country].name,
    name: buildName(country),
    addressLine1: buildStreetLine(country),
    addressLine2: buildSecondaryLine(country),
    city,
    region,
    postalCode: buildPostal(country),
  };
}
