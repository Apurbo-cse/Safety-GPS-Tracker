/**
 * Dumps the website's built-in products, plans and FAQs to backend/src/seed/catalog.json,
 * which `npm run seed` (in backend/) loads into PostgreSQL.
 *   npx tsx scripts/export-catalog.ts
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { plans } from "../src/data/pricing";
import { devices } from "../src/data/devices";
import { FAQS } from "../src/data/faqs";
import { heroSlides } from "../src/data/hero";

const out = {
  plans: plans.map((p, i) => ({ ...p, sort: i })),
  devices: devices.map((d, i) => ({ ...d, sort: i })),
  faqs: FAQS.map((f, i) => ({ ...f, sort: i })),
  heroSlides: heroSlides.map((h, i) => ({ ...h, sort: i })),
};
const dir = join(__dirname, "..", "backend", "src", "seed");
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, "catalog.json"), JSON.stringify(out, null, 2) + "\n");
console.log(`plans=${out.plans.length} devices=${out.devices.length} faqs=${out.faqs.length} heroSlides=${out.heroSlides.length}`);
