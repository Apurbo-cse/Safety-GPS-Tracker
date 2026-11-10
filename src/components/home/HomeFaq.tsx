import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import Accordion from "@/components/common/Accordion";
import { homeFaqs } from "@/data/testimonials";

export default function HomeFaq() {
  return (
    <section className="py-16 sm:py-20">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow="FAQ" title="Frequently asked questions" />
        <Accordion items={homeFaqs} />
      </Container>
    </section>
  );
}
