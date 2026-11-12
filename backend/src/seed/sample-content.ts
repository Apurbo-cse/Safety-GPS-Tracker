import "reflect-metadata";
import "dotenv/config";
import { Faq } from "../catalog/catalog.entities";
import { sanitizeRich, plainText } from "../common/html";
import dataSource from "../database/data-source";
import { Post } from "../posts/post.entity";

/**
 * Starter News posts and FAQs, written for the Safety GPS Tracker website. They only describe things the product does
 * (no statistics, no customer stories) — edit or delete them in Admin → News / FAQs.
 *   npm run seed:samples
 * Safe to re-run: a row is added only when its id is free, so nothing you edited is ever overwritten.
 */
const day = (n: number) => new Date(Date.now() - n * 86_400_000);

const POSTS: { id: string; title: string; cover: string; daysAgo: number; content: string }[] = [
  {
    id: "how-gps-vehicle-tracking-works", title: "How GPS vehicle tracking works, in plain words", cover: "/img/hero-car.jpg", daysAgo: 3,
    content: `<p>A tracker looks complicated from the outside, but the idea is simple: a small device in your vehicle works out where it is, and sends that position to you.</p>
<h2>From satellite to your phone</h2>
<ul><li><strong>GPS signal</strong> — the device listens to satellites and calculates its position and speed.</li><li><strong>Mobile network</strong> — it sends that reading to our platform over a mobile data connection.</li><li><strong>Platform and apps</strong> — the reading appears on the map in the Android, iOS and web apps. Positions refresh about every 10 seconds.</li></ul>
<h2>What affects accuracy</h2>
<p>Tall buildings, tunnels and covered car parks can weaken the GPS signal, and the mobile network has to be available to deliver the reading. In places without coverage, updates can be delayed and then resume when the device reconnects.</p>
<h2>Beyond the dot on the map</h2>
<p>Because the device also notices when the engine starts, how fast the vehicle moves and whether it has been disconnected, you can switch on alerts for the events you care about — and, on supported packages, lock the engine remotely.</p>
<p>Not sure which package fits your vehicle? Our team is on the helpline day and night.</p>`,
  },
  {
    id: "protect-your-car-from-theft", title: "Five simple habits that make car theft harder", cover: "/img/industries/private-cars-hd.jpg", daysAgo: 8,
    content: `<p>No single product makes a vehicle theft-proof, but a few habits — and the right alerts — make it much harder for someone to drive away unnoticed.</p>
<h2>1. Turn on ignition alerts</h2>
<p>An alert the moment the engine starts tells you if the vehicle is being used when it shouldn't be.</p>
<h2>2. Draw a geo-fence around where you park</h2>
<p>If the vehicle leaves its usual spot, you are told straight away, not hours later.</p>
<h2>3. Keep the engine-lock option ready</h2>
<p>On supported packages you can lock the engine from the app. Use it carefully and only when it is safe to do so.</p>
<h2>4. Switch on the device-removal alert</h2>
<p>If someone disconnects the tracker, you get an alert instead of silence.</p>
<h2>5. Know who to call</h2>
<ul><li>Save the helpline number in your phone.</li><li>Keep your registration and insurance details handy.</li><li>Tell the police the live location if the vehicle is taken.</li></ul>`,
  },
  {
    id: "choosing-the-right-tracking-package", title: "Choosing the right package: car, bike or truck", cover: "/img/hero-truck.jpg", daysAgo: 14,
    content: `<p>Every package has a one-time device price and a monthly service charge. Here is how to think about which one fits.</p>
<h2>Start with the vehicle</h2>
<ul><li><strong>Cars and microbuses</strong> — a full alert set and, if you want it, voice monitoring.</li><li><strong>Motorcycles</strong> — a compact device with live tracking and engine lock.</li><li><strong>Trucks and covered vans</strong> — packages built for long routes and daily mileage reports.</li><li><strong>Equipment</strong> — working-hours reports and geo-fence alerts for machines on site.</li></ul>
<h2>Then decide what you need to see</h2>
<p>Voice monitoring lets you listen to the cabin on supported packages, and there is a video-and-voice option for those who want to see as well. If you only need location and alerts, a simpler package keeps the monthly charge low.</p>
<h2>Use the plan finder</h2>
<p>The pricing page has a short quiz: pick your vehicle, the monitoring you want and what matters most (device price, monthly charge or first-year cost) and it recommends a package.</p>`,
  },
  {
    id: "geo-fencing-explained", title: "Geo-fencing explained: draw a boundary, get an alert", cover: "/img/industries/construction-hd.jpg", daysAgo: 21,
    content: `<p>A geo-fence is a virtual boundary on the map. When a vehicle crosses it, you get an alert.</p>
<h2>Where it helps</h2>
<ul><li><strong>A family car</strong> — know when it leaves home or the office car park.</li><li><strong>Construction equipment</strong> — get alerted if a machine leaves the site after hours.</li><li><strong>Delivery vehicles</strong> — see when a driver reaches or leaves a depot or customer area.</li></ul>
<h2>Setting one up</h2>
<ul><li>Open the vehicle in the app.</li><li>Choose the geo-fence option and mark the area.</li><li>Pick whether you want alerts on entering, leaving or both.</li></ul>
<h2>Tips</h2>
<p>Make the zone a little larger than the place itself, so normal GPS drift near the edge doesn't set off false alerts.</p>`,
  },
  {
    id: "keep-papers-and-insurance-up-to-date", title: "Never miss a BRTA paper or insurance date again", cover: "/img/industries/business-fleet-v3.jpg", daysAgo: 30,
    content: `<p>Expired papers mean fines, delays and trouble at checkpoints. The app can remind you before it happens.</p>
<h2>What you can track</h2>
<ul><li>BRTA paper updates</li><li>Insurance expiry</li><li>Engine oil changes</li></ul>
<h2>How the reminders work</h2>
<p>You enter the dates once for each vehicle. As a date gets close, the app sends a reminder so you have time to renew.</p>
<h2>For fleets</h2>
<p>If you manage several vehicles, keeping every date in one place means one person can check what is due this month instead of chasing each driver.</p>`,
  },
  {
    id: "three-reports-that-cut-running-costs", title: "Three reports every fleet owner should read", cover: "/img/industries/logistics-bd.jpg", daysAgo: 42,
    content: `<p>Live tracking is useful; the reports behind it are where you find savings.</p>
<h2>1. Daily mileage</h2>
<p>How far each vehicle really travelled. Compare it with what the job needed and unexplained extra distance stands out.</p>
<h2>2. Parking and stops</h2>
<p>Long, repeated stops in the same place are worth a conversation with the driver — or a change to the route.</p>
<h2>3. Working hours</h2>
<p>For equipment and delivery vehicles, working hours show how much a machine is actually used, which helps with maintenance planning.</p>
<p>All three are available in the web platform and the apps, so managers and owners see the same numbers.</p>`,
  },
];

const FAQS: { id: string; category: string; q: string; a: string; tag: string }[] = [
  { id: "no-signal-area", category: "Tracking & GPS", tag: "coverage", q: "What happens if my vehicle goes where there is no mobile signal?", a: "<p>The tracker needs the mobile network to send its position. Without signal, updates can be delayed or unavailable, and they continue when the device reconnects.</p>" },
  { id: "route-history", category: "Tracking & GPS", tag: "history", q: "Can I see where my vehicle went earlier?", a: "<p>Yes. Route history and travel history let you replay past trips, and reports show daily mileage and stops.</p>" },
  { id: "which-apps", category: "Tracking & GPS", tag: "apps", q: "Which apps can I use to track?", a: "<p>There are Android and iOS apps and a web platform. They show the same vehicles, so you can switch between phone and computer.</p>" },
  { id: "engine-lock-safety", category: "Security & Relay", tag: "engine lock", q: "Is it safe to lock the engine while the vehicle is moving?", a: "<p>Use remote engine lock carefully. Lock a vehicle only when it is safe to do so and where the law allows. If you are unsure, call the helpline first.</p>" },
  { id: "device-removal-alert", category: "Security & Relay", tag: "alerts", q: "What does the device-removal alert do?", a: "<p>If the tracker is disconnected from the vehicle, you receive an alert so you know someone may have tampered with it.</p>" },
  { id: "panic-button", category: "Security & Relay", tag: "panic", q: "What is the panic button?", a: "<p>It is an emergency alert you can trigger in an urgent situation so that the alert reaches you and your team straight away.</p>" },
  { id: "install-where", category: "Hardware & Sensors", tag: "installation", q: "Who installs the device, and where?", a: "<p>Our technicians fit and test the tracker in your vehicle at your doorstep, in all 64 districts. You choose a preferred date at checkout.</p>" },
  { id: "fuel-monitoring", category: "Hardware & Sensors", tag: "fuel", q: "Can I monitor fuel?", a: "<p>Fuel-rod monitoring is available with selected products. Open the Products page for what is offered now, or ask the team which option suits your vehicle.</p>" },
  { id: "voice-monitoring", category: "Hardware & Sensors", tag: "voice", q: "What is voice monitoring?", a: "<p>On supported packages you can listen to the cabin. Use it responsibly and tell drivers the vehicle is monitored — see our <a href=\"/privacy\">Privacy Policy</a>.</p>" },
  { id: "change-package-later", category: "Pricing & Packages", tag: "upgrade", q: "Can I change my package later?", a: "<p>Call the helpline and the team will discuss options for your vehicle and account.</p>" },
  { id: "hidden-charges", category: "Pricing & Packages", tag: "pricing", q: "Are there hidden charges?", a: "<p>Each package shows a one-time device price and a monthly service charge, and installation is part of the order. The checkout shows the totals before you place the order.</p>" },
  { id: "company-invoice", category: "Billing & Support", tag: "invoice", q: "How do I get an invoice for my company?", a: "<p>At checkout, add the company name, address and BIN / TIN under <b>Billing</b>. Afterwards open <b>My orders → Invoice</b> to print or save it as a PDF.</p>" },
  { id: "cancel-order", category: "Billing & Support", tag: "orders", q: "Can I cancel an order?", a: "<p>You can cancel from <b>My orders</b> while the order is still marked Received. After the team confirms it, please call the helpline.</p>" },
  { id: "discount-codes", category: "Billing & Support", tag: "coupon", q: "Do you have discount codes?", a: "<p>When we run an offer, you enter its code in the <b>Discount code</b> box at checkout. The discount applies to the device price.</p>" },
  { id: "update-profile", category: "Billing & Support", tag: "account", q: "How do I change my phone number or email?", a: "<p>Open your <b>Profile</b>, edit the details and save. They are used the next time you check out.</p>" },
];

async function main() {
  await dataSource.initialize();
  await dataSource.runMigrations();
  const posts = dataSource.getRepository(Post);
  const faqs = dataSource.getRepository(Faq);

  let addedPosts = 0;
  for (const p of POSTS) {
    if (await posts.exists({ where: { id: p.id } })) continue;
    const content = sanitizeRich(p.content);
    await posts.save(posts.create({ id: p.id, title: p.title, excerpt: plainText(content).slice(0, 160), cover: p.cover, content, published: true, publishedAt: day(p.daysAgo) }));
    addedPosts++;
  }

  const top = (await faqs.createQueryBuilder("f").select("COALESCE(MAX(f.sort), 0)", "m").getRawOne<{ m: number }>())?.m ?? 0;
  let addedFaqs = 0;
  for (const [i, f] of FAQS.entries()) {
    if (await faqs.exists({ where: { id: f.id } })) continue;
    await faqs.save(faqs.create({ id: f.id, category: f.category, q: f.q, a: sanitizeRich(f.a), tag: f.tag, sort: Number(top) + 1 + i, active: true }));
    addedFaqs++;
  }
  console.log(`Added ${addedPosts} posts and ${addedFaqs} FAQs (existing rows were left alone).`);
  await dataSource.destroy();
}
main().catch((e) => { console.error(e); process.exit(1); });
