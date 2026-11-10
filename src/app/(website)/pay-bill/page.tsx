import PageHero from "@/components/common/PageHero";
import Container from "@/components/common/Container";
import Image from "next/image";
import PayBillForm from "@/components/forms/PayBillForm";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta("Pay Bill", "Pay your Safety GPS Tracker bill with bKash, Nagad, Rocket or bank transfer (demo interface).", "/pay-bill");

export default function PayBillPage() {
  return (
    <>
      <PageHero art="van" eyebrow="Pay bill" title="Pay your monthly bill" description="Enter your invoice details, preview the invoice and confirm. This page is a demonstration interface." />
      <Container className="max-w-2xl py-12"><div className="rounded-2xl border border-line bg-surface p-5 shadow-sm sm:p-7"><PayBillForm /></div>
        <figure className="mt-6 rounded-xl border border-line bg-white p-4"><Image src="/img/payments.png" alt="Supported payment methods on the company website" width={1400} height={226} className="h-auto w-full" /><figcaption className="mt-2 text-center text-xs text-slate-500">Payment methods shown on the company website. This page is a demo and does not process payments.</figcaption></figure></Container>
    </>
  );
}
