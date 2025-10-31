#!/usr/bin/env node
/**
 * Build Alexandria's World review data from the source image repository.
 *
 * Scans the `alexandrias-world-book-design/countries` directory, determines the
 * available page images for each country, and emits a structured JSON manifest
 * that powers the review website.
 *
 * Usage:
 *   node scripts/generate-book-data.mjs
 *
 * Optional environment variables:
 *   ALEXANDRIA_COUNTRIES_PATH  Absolute path to the `countries` directory.
 *   ALEXANDRIA_RAW_BASE_URL    Base URL where images are hosted (defaults to
 *                              the GitHub raw URL for the master branch).
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const DEFAULT_COUNTRIES_PATH = path.resolve(
  projectRoot,
  '..',
  'alexandrias-world-book-design',
  'countries'
);

const countriesPath =
  process.env.ALEXANDRIA_COUNTRIES_PATH ?? DEFAULT_COUNTRIES_PATH;

const DEFAULT_RAW_BASE_URL =
  'https://raw.githubusercontent.com/charlesmartinedd/alexandrias-world-book-design/master';

const rawBaseUrl =
  process.env.ALEXANDRIA_RAW_BASE_URL ?? DEFAULT_RAW_BASE_URL;

const OUTPUT_PATH = path.join(projectRoot, 'public', 'data', 'books.json');

/**
 * Order of page labels used to group the story flow.
 */
const PAGE_LABELS = {
  1: 'Cover',
  2: 'Introduction',
  3: 'Arrival',
  4: 'Plane Window',
  5: 'Meeting Friend',
  6: 'With Family',
  7: 'Traditional Meal',
  8: 'Cultural Story',
  9: 'Landmark Visit',
  10: 'Second Landmark',
  11: 'Third Landmark',
  12: 'Activity',
  13: 'Playground',
  14: 'Goodbye',
};

/**
 * Directory name overrides that map to the slug derived from the metadata
 * dictionary.
 */
const SLUG_ALIASES = new Map([
  ['usa', 'united_states'],
  ['uk', 'united_kingdom'],
  ['ivory_coast', 'cote_divoire'],
  ['cote_divoire', 'cote_divoire'],
  ['uae', 'united_arab_emirates'],
  ['dr_congo', 'democratic_republic_of_the_congo'],
]);

const CONTINENT_FALLBACKS = new Map();

const registerContinent = (continent, slugs) => {
  for (const slug of slugs) {
    CONTINENT_FALLBACKS.set(slug, continent);
  }
};

registerContinent('Africa', [
  'congo',
  'democratic_republic_of_the_congo',
  'dr_congo',
  'djibouti',
  'equatorial_guinea',
  'eritrea',
  'eswatini',
  'ethiopia',
  'gabon',
  'gambia',
  'ghana',
  'guinea',
  'guinea_bissau',
  'ivory_coast',
  'lesotho',
  'liberia',
  'libya',
  'madagascar',
  'malawi',
  'mali',
  'mauritania',
  'mauritius',
  'mozambique',
  'namibia',
  'niger',
  'rwanda',
  'sao_tome_and_principe',
  'senegal',
  'seychelles',
  'sierra_leone',
  'somalia',
  'south_sudan',
  'sudan',
  'tanzania',
  'togo',
  'tunisia',
  'uganda',
  'zambia',
  'zimbabwe',
]);

registerContinent('Europe', [
  'croatia',
  'cyprus',
  'czech_republic',
  'denmark',
  'estonia',
  'finland',
  'georgia',
  'greece',
  'hungary',
  'iceland',
  'ireland',
  'latvia',
  'liechtenstein',
  'lithuania',
  'luxembourg',
  'malta',
  'moldova',
  'monaco',
  'montenegro',
  'netherlands',
  'north_macedonia',
  'norway',
  'poland',
  'portugal',
  'romania',
  'russia',
  'san_marino',
  'serbia',
  'slovakia',
  'slovenia',
  'sweden',
  'switzerland',
  'ukraine',
  'vatican_city',
]);

registerContinent('Asia', [
  'east_timor',
  'iran',
  'iraq',
  'israel',
  'jordan',
  'kazakhstan',
  'kuwait',
  'kyrgyzstan',
  'laos',
  'lebanon',
  'malaysia',
  'maldives',
  'mongolia',
  'myanmar',
  'nepal',
  'north_korea',
  'oman',
  'pakistan',
  'palestine',
  'philippines',
  'qatar',
  'saudi_arabia',
  'singapore',
  'south_korea',
  'sri_lanka',
  'syria',
  'taiwan',
  'tajikistan',
  'turkey',
  'turkmenistan',
  'united_arab_emirates',
  'uzbekistan',
  'vietnam',
  'yemen',
]);

registerContinent('North America', [
  'costa_rica',
  'cuba',
  'dominica',
  'dominican_republic',
  'el_salvador',
  'grenada',
  'guatemala',
  'haiti',
  'honduras',
  'jamaica',
  'nicaragua',
  'panama',
  'saint_kitts_and_nevis',
  'saint_lucia',
  'saint_vincent_and_the_grenadines',
  'trinidad_and_tobago',
]);

registerContinent('South America', [
  'ecuador',
  'guyana',
  'paraguay',
  'suriname',
  'uruguay',
  'venezuela',
]);

registerContinent('Oceania', [
  'fiji',
  'kiribati',
  'marshall_islands',
  'micronesia',
  'nauru',
  'new_zealand',
  'palau',
  'papua_new_guinea',
  'samoa',
  'solomon_islands',
  'tonga',
  'tuvalu',
  'vanuatu',
]);

/**
 * Manual metadata for the 20 "completed" countries that are not present in
 * `remaining_countries.json`.
 */
const COMPLETED_COUNTRY_METADATA = [
  { name: 'Brazil', code: 'BR', continent: 'South America' },
  { name: 'Canada', code: 'CA', continent: 'North America' },
  { name: 'China', code: 'CN', continent: 'Asia' },
  { name: 'Egypt', code: 'EG', continent: 'Africa' },
  { name: 'France', code: 'FR', continent: 'Europe' },
  { name: 'Germany', code: 'DE', continent: 'Europe' },
  { name: 'India', code: 'IN', continent: 'Asia' },
  { name: 'Indonesia', code: 'ID', continent: 'Asia' },
  { name: 'Italy', code: 'IT', continent: 'Europe' },
  { name: 'Japan', code: 'JP', continent: 'Asia' },
  { name: 'Kenya', code: 'KE', continent: 'Africa' },
  { name: 'Mexico', code: 'MX', continent: 'North America' },
  { name: 'Morocco', code: 'MA', continent: 'Africa' },
  { name: 'Nigeria', code: 'NG', continent: 'Africa' },
  { name: 'Peru', code: 'PE', continent: 'South America' },
  { name: 'South Africa', code: 'ZA', continent: 'Africa' },
  { name: 'Spain', code: 'ES', continent: 'Europe' },
  { name: 'Thailand', code: 'TH', continent: 'Asia' },
  { name: 'United Kingdom', code: 'GB', continent: 'Europe' },
  { name: 'United States', code: 'US', continent: 'North America' },
];

const stripDiacritics = (value) =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/’/g, "'");

const nameToSlug = (name) =>
  stripDiacritics(name)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/'/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[\s-]/g, '_');

const niceCase = (value) =>
  value
    .split(/[\s_]+/)
    .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : ''))
    .join(' ')
    .replace(/\bAnd\b/g, 'and')
    .replace(/\bOf\b/g, 'of')
    .replace(/\bThe\b/g, 'the');

async function ensureOutputDirectory() {
  const dir = path.dirname(OUTPUT_PATH);
  await fs.mkdir(dir, { recursive: true });
}

async function loadMetadataDictionary() {
  const metadataPath = path.resolve(
    countriesPath,
    '..',
    'scripts',
    'remaining_countries.json'
  );

  let remainingData = { remaining_countries: [] };
  try {
    const raw = await fs.readFile(metadataPath, 'utf8');
    remainingData = JSON.parse(raw);
  } catch (error) {
    console.warn(
      '[warn] Could not load scripts/remaining_countries.json. ' +
        'Only basic metadata will be available.'
    );
  }

  const metadataBySlug = new Map();
  const metadataByCode = new Map();

  const ingest = (entry) => {
    const slug = nameToSlug(entry.name);
    metadataBySlug.set(slug, entry);
    if (entry.code) {
      metadataByCode.set(entry.code.toUpperCase(), entry);
    }
  };

  for (const entry of remainingData.remaining_countries ?? []) {
    ingest(entry);
  }

  for (const entry of COMPLETED_COUNTRY_METADATA) {
    ingest(entry);
  }

  return { metadataBySlug, metadataByCode };
}

function resolveMetadata(slug, metadataBySlug, metadataByCode) {
  const normalizedSlug = SLUG_ALIASES.get(slug) ?? slug;
  if (metadataBySlug.has(normalizedSlug)) {
    return metadataBySlug.get(normalizedSlug);
  }

  if (metadataByCode.has(slug.toUpperCase())) {
    return metadataByCode.get(slug.toUpperCase());
  }

  if (slug === 'usa') {
    return metadataByCode.get('US');
  }
  if (slug === 'uk') {
    return metadataByCode.get('GB');
  }

  return null;
}

function buildImageRecord(countrySlug, fileName) {
  const pageMatch = fileName.match(/^page_(\d{2})_(.*)\.png$/i);
  if (!pageMatch) {
    return null;
  }

  const pageNumber = parseInt(pageMatch[1], 10);
  const descriptor = pageMatch[2];

  const titleFromFilename = niceCase(descriptor);
  const defaultLabel = PAGE_LABELS[pageNumber] ?? `Page ${pageNumber}`;

  const title =
    descriptor && descriptor.length > 0 && descriptor !== 'page'
      ? titleFromFilename
      : defaultLabel;

  const imageUrl = `${rawBaseUrl}/countries/${countrySlug}/images/${fileName}`;

  return {
    number: pageNumber,
    fileName,
    title,
    label: defaultLabel,
    imageUrl,
  };
}

async function buildCountryRecord(slug, metadataBySlug, metadataByCode) {
  const imagesDir = path.join(countriesPath, slug, 'images');
  let imageFiles = [];
  try {
    imageFiles = await fs.readdir(imagesDir);
  } catch {
    imageFiles = [];
  }

  const pageImages = imageFiles
    .filter((file) => file.toLowerCase().endsWith('.png'))
    .map((file) => buildImageRecord(slug, file))
    .filter(Boolean)
    .sort((a, b) => a.number - b.number);

  const expectedPages = 14;
  const availablePageNumbers = new Set(pageImages.map((p) => p.number));
  const missingPages = [];
  for (let page = 1; page <= expectedPages; page += 1) {
    if (!availablePageNumbers.has(page)) {
      missingPages.push(page);
    }
  }

  const metadata = resolveMetadata(slug, metadataBySlug, metadataByCode);

  const derivedName = niceCase(slug.replace(/_/g, ' '));
  const countryName = metadata?.name ?? derivedName;

  const status =
    pageImages.length === 0
      ? 'empty'
      : missingPages.length === 0
      ? 'complete'
      : 'incomplete';

  const coverImage = pageImages.find((page) => page.number === 1) ?? null;

  const continent = metadata?.continent ?? CONTINENT_FALLBACKS.get(slug) ?? null;

  return {
    slug,
    name: countryName,
    code: metadata?.code ?? null,
    continent,
    friendName: metadata?.friend_name ?? null,
    traditionalDress: metadata?.traditional_dress ?? null,
    landmarks: [
      metadata?.landmark_1,
      metadata?.landmark_2,
      metadata?.landmark_3,
    ].filter(Boolean),
    signatureFood: metadata?.food ?? null,
    culturalActivity: metadata?.activity ?? null,
    language: metadata?.language ?? null,
    status,
    totalPages: expectedPages,
    availablePages: pageImages.length,
    missingPages,
    coverImage,
    pages: pageImages,
  };
}

async function buildManifest() {
  const { metadataBySlug, metadataByCode } = await loadMetadataDictionary();

  let countryDirs = [];
  try {
    countryDirs = await fs.readdir(countriesPath);
  } catch (error) {
    throw new Error(
      `Unable to read countries directory at ${countriesPath}. ` +
        'Set ALEXANDRIA_COUNTRIES_PATH to override the location.'
    );
  }

  const manifest = [];
  for (const dirName of countryDirs) {
    const stats = await fs.lstat(path.join(countriesPath, dirName));
    if (!stats.isDirectory()) continue;

    const record = await buildCountryRecord(
      dirName,
      metadataBySlug,
      metadataByCode
    );
    manifest.push(record);
  }

  const ordered = manifest.sort((a, b) =>
    a.name.localeCompare(b.name, 'en', { sensitivity: 'base' })
  );

  return {
    generatedAt: new Date().toISOString(),
    sourceBasePath: countriesPath,
    imageBaseUrl: `${rawBaseUrl}/countries`,
    totalCountries: ordered.length,
    countries: ordered,
  };
}

async function main() {
  await ensureOutputDirectory();
  const manifest = await buildManifest();
  await fs.writeFile(
    OUTPUT_PATH,
    JSON.stringify(manifest, null, 2) + '\n',
    'utf8'
  );
  console.log(`Generated manifest for ${manifest.totalCountries} countries.`);
  console.log(`Output written to ${OUTPUT_PATH}`);
}

main().catch((error) => {
  console.error('[error] Failed to build manifest:', error);
  process.exit(1);
});
