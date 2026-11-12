import { DEFAULT_PLAN_VEHICLES } from "../common/vehicles";
import "reflect-metadata";
import "dotenv/config";
import { normalizePhone } from "../common/phone";
import { Category, Device, Faq, HeroSlide, Plan } from "../catalog/catalog.entities";
import dataSource from "../database/data-source";
import { User } from "../users/user.entity";
import * as bcrypt from "bcryptjs";
import catalog from "./catalog.json";

/**
 * Loads the website's products, plans and FAQs into PostgreSQL (safe to re-run: rows are upserted by id)
 * and creates the first admin when ADMIN_EMAIL + ADMIN_PASSWORD are set.
 *   npm run seed            (development)
 *   npm run seed:prod       (after `npm run build`)
 * Re-running overwrites edits made through the admin API for these ids — use --if-empty to skip when data exists.
 */
async function main() {
  const ifEmpty = process.argv.includes("--if-empty");
  await dataSource.initialize();
  await dataSource.runMigrations();

  const plans = dataSource.getRepository(Plan);
  const devices = dataSource.getRepository(Device);
  const faqs = dataSource.getRepository(Faq);
  const categories = dataSource.getRepository(Category);
  const heroSlides = dataSource.getRepository(HeroSlide);

  if (ifEmpty && (await plans.count()) > 0) {
    console.log("Catalogue already has data — skipping (--if-empty).");
  } else {
    await plans.save(catalog.plans.map((p) => plans.create({
      id: p.id, name: p.name, devicePrice: p.devicePrice, monthlyCharge: p.monthlyCharge, features: p.features,
      highlight: ("highlight" in p ? p.highlight : null) ?? null, image: p.image ?? null, siteTitle: p.siteTitle ?? null, sourceNo: p.sourceNo, sort: p.sort, active: true, vehicles: DEFAULT_PLAN_VEHICLES[p.id] ?? [],
    })));
    // categories first: products must point at categories that exist
    const slugOf = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const PREFERRED = ["GPS Tracking Devices", "Voice Monitoring Devices", "Video & Voice Monitoring Devices", "Vehicle GPS Hardware"];
    const rank = (n: string) => (PREFERRED.includes(n) ? PREFERRED.indexOf(n) : PREFERRED.length);
    const tops = [...new Set(catalog.devices.map((d) => d.category))].sort((a, b) => rank(a) - rank(b));
    await categories.save(tops.map((name, i) => categories.create({ id: slugOf(name), name, parentId: null, sort: i, active: true })));
    for (const top of tops) {
      const subs = [...new Set(catalog.devices.filter((d) => d.category === top).map((d) => d.subcategory))];
      await categories.save(subs.map((name, i) => categories.create({ id: `${slugOf(top)}-${slugOf(name)}`.slice(0, 80), name, parentId: slugOf(top), sort: i, active: true })));
    }
    await devices.save(catalog.devices.map((d) => devices.create({
      id: d.id, name: d.name, category: d.category, subcategory: d.subcategory, visual: d.visual,
      image: `/img/products/${d.id}.png`, siteTitle: ("siteTitle" in d ? d.siteTitle : null) ?? null, summary: d.summary,
      specs: d.specs, features: d.features, price: ("price" in d ? d.price : null) ?? null, monthly: ("monthly" in d ? d.monthly : null) ?? null,
      planId: ("planId" in d ? d.planId : null) ?? null, priceNote: d.priceNote, sort: d.sort, active: true,
    })));
    await faqs.save(catalog.faqs.map((f) => faqs.create({ id: f.id, category: f.category, q: f.q, a: f.a, tag: f.tag, sort: f.sort, active: true })));
    console.log(`Seeded ${catalog.plans.length} plans, ${catalog.devices.length} devices, ${catalog.faqs.length} FAQs.`);
  }

  // hero slides are seeded on their own, only when the table is empty, so existing databases get them without losing catalogue edits
  if ((await heroSlides.count()) === 0) {
    await heroSlides.save(catalog.heroSlides.map((h) => heroSlides.create({
      id: h.id, tab: h.tab, badge: h.badge, badgeIcon: h.badgeIcon, titleMain: h.titleMain, titleHighlight: h.titleHighlight, text: h.text,
      bgImage: h.bgImage, accent: h.accent, ctaLabel: h.ctaLabel, ctaHref: h.ctaHref, telematics: h.telematics as HeroSlide["telematics"], sort: h.sort, active: true,
    })));
    console.log(`Seeded ${catalog.heroSlides.length} hero slides.`);
  }

  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (email && password) {
    const users = dataSource.getRepository(User);
    if (await users.exists({ where: { email } })) {
      console.log(`Admin ${email} already exists.`);
    } else {
      if (password.length < 8 || password.length > 72) throw new Error("ADMIN_PASSWORD must be 8–72 characters");
      await users.save(users.create({
        email, name: "Administrator", phone: normalizePhone(process.env.ADMIN_PHONE ?? "") ?? null, role: "admin", staffRoleId: "owner",
        passwordHash: await bcrypt.hash(password, 12),
      }));
      console.log(`Created admin ${email}.`);
    }
  } else {
    console.log("ADMIN_EMAIL / ADMIN_PASSWORD not set — no admin created.");
  }
  await dataSource.destroy();
}
main().catch((e) => { console.error(e); process.exit(1); });
