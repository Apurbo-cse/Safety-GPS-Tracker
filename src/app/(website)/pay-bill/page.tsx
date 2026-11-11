import PageHero from "@/components/common/PageHero";
import Container from "@/components/common/Container";
import PayBillForm from "@/components/forms/PayBillForm";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta("Pay Bill", "Pay your Safety GPS Tracker bill with bKash, Nagad, Rocket or bank transfer (demo interface).", "/pay-bill");

export default function PayBillPage() {
  return (
    <>
      <PageHero art="van" eyebrow="Pay bill" title="Pay your monthly bill" description="Enter your invoice details, review and confirm. This page is a demonstration interface — no money is charged." />
      <section className="bg-sec-gray">
        <Container className="py-6 sm:py-8">
          <PayBillForm />
        </Container>
      </section>
    </>
  );
}
