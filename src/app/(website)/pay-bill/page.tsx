import PageHero from "@/components/common/PageHero";
import Container from "@/components/common/Container";
import PayBillForm from "@/components/forms/PayBillForm";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta("Pay Bill", "Pay your Safety GPS Tracker bill with bKash, Nagad, Rocket or bank transfer (demo interface).", "/pay-bill");

export default function PayBillPage() {
  return (
    <>
      <PageHero
        art="van"
        eyebrow="Billing Portal"
        badgeText="Instant Online Payment"
        title="Pay Your Monthly Service Bill"
        titleHighlight="Quickly & Securely"
        description="Enter your vehicle registration or invoice number to pay your monthly tracking subscription via bKash, Nagad, Rocket or cards."
      />
      <section className="bg-soft py-10 sm:py-14">
        <Container className="max-w-3xl">
          <PayBillForm />
        </Container>
      </section>
    </>
  );
}
