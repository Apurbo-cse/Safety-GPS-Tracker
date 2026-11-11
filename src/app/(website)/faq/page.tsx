import PageHero from "@/components/common/PageHero";
import FaqExplorer from "@/components/faq/FaqExplorer";
import ContactCta from "@/components/home/ContactCta";
import { FAQS } from "@/data/faqs";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta(
  "Frequently Asked Questions",
  "Answers about live GPS tracking, remote engine lock, devices and installation, packages and pricing, billing and support.",
  "/faq",
);

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

export default function FaqPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <PageHero
        art="car"
        eyebrow="Help centre"
        title="Frequently asked questions"
        description={`${FAQS.length} answers about tracking, security, devices, packages and billing — search or browse by topic.`}
      />
      <FaqExplorer />
      <ContactCta className="bg-sec-warm" title="Still have a question?" />
    </>
  );
}
