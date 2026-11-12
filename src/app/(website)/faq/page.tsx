import PageHero from "@/components/common/PageHero";
import FaqExplorer from "@/components/faq/FaqExplorer";
import ContactCta from "@/components/home/ContactCta";
import { getCatalog } from "@/lib/catalog.server";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta(
  "Frequently Asked Questions",
  "Answers about live GPS tracking, remote engine lock, devices and installation, packages and pricing, billing and support.",
  "/faq",
);

export default async function FaqPage() {
  const { faqs: FAQS } = await getCatalog();
  /** FAQPage structured data for search engines */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <PageHero
        art="car"
        eyebrow="Help Centre"
        badgeText="24/7 Knowledge Base"
        title="Frequently Asked Questions"
        titleHighlight="& Support Guide"
        description={`${FAQS.length} detailed answers about live tracking, remote engine lock, device installation, pricing packages and monthly billing — search or browse by topic.`}
      />
      <FaqExplorer />
      <ContactCta className="bg-sec-warm" title="Still have a question?" />
    </>
  );
}
