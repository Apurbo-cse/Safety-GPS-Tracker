import PageHero from "@/components/common/PageHero";
import LegalPage, { type LegalSection } from "@/components/legal/LegalPage";
import { SITE } from "@/lib/site";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta("Terms of Service", "The terms that apply when you use Safety GPS Tracker devices, apps and services.", "/terms");

const sections: LegalSection[] = [
  { id: "acceptance", title: "Acceptance of terms", body: (<p>By buying a package, installing a tracking device, or using our apps or web platform, you agree to these terms. If you are using the service for a business, you confirm that you can accept these terms on its behalf.</p>) },
  { id: "service", title: "The service", body: (<>
    <p>{SITE.name} provides GPS tracking devices and software that show vehicle location, alerts, reports and, depending on the package, remote engine lock, voice monitoring or video monitoring.</p>
    <p>Location accuracy and update speed depend on GPS signal, mobile network coverage and device condition. Tracking may be delayed or unavailable in areas without signal.</p>
  </>) },
  { id: "packages", title: "Packages, payment and renewal", body: (<ul>
    <li>Each package has a one-time device price and a monthly service charge, shown on our pricing page.</li>
    <li>Monthly charges must be paid on time to keep the service active. If a bill is unpaid, the service may be paused until payment is made.</li>
    <li>Prices may change; we will tell you before a change applies to your account.</li>
  </ul>) },
  { id: "installation", title: "Device installation and care", body: (<ul>
    <li>Devices should be installed by our technicians or approved installers.</li>
    <li>Do not remove, open or tamper with the device. Damage caused by tampering, accidents, water or unauthorised repair is not covered.</li>
    <li>Tell us if you sell the vehicle or move the device to another vehicle.</li>
  </ul>) },
  { id: "use", title: "Acceptable use", body: (<>
    <p>You agree to use the service only for lawful purposes. You must not:</p>
    <ul>
      <li>Track a vehicle or person without the right or consent to do so.</li>
      <li>Use voice or video monitoring in a way that breaks privacy laws.</li>
      <li>Share your log-in with people who should not have access, or try to break into the platform.</li>
    </ul>
  </>) },
  { id: "engine-lock", title: "Remote engine lock", body: (<p>Use remote engine lock carefully. Lock a vehicle only when it is safe to do so and where permitted by law. We are not responsible for loss or injury caused by misuse of the engine lock feature.</p>) },
  { id: "account", title: "Your account", body: (<p>You are responsible for keeping your password safe and for activity on your account. Contact us right away if you think someone else has accessed it.</p>) },
  { id: "liability", title: "Limitation of liability", body: (<p>The service helps you monitor and protect your vehicles, but it is not a guarantee against theft, accident or loss. To the extent allowed by law, our liability is limited to the service charges you paid for the month in which the issue occurred.</p>) },
  { id: "termination", title: "Suspension and termination", body: (<p>You may stop the service at any time by contacting support. We may suspend or end the service if these terms are broken or bills remain unpaid. Charges already paid are not refunded unless required by law.</p>) },
  { id: "law", title: "Governing law", body: (<p>These terms are governed by the laws of Bangladesh. Any dispute will be handled by the courts of Dhaka.</p>) },
  { id: "changes", title: "Changes and contact", body: (<p>We may update these terms; the &quot;Last updated&quot; date shows the current version. Questions? Call {SITE.phone} or email {SITE.email}.</p>) },
];

export default function TermsPage() {
  return (
    <>
      <PageHero
        art="van"
        eyebrow="Legal & Compliance"
        badgeText="Terms & Conditions"
        title="Terms of Service & Usage"
        titleHighlight="Agreement"
        description="Clear terms governing your subscription, tracking hardware ownership, service renewals, and lawful usage of the Safety GPS Tracker telematics platform."
      />
      <LegalPage
        updated="10 November 2026"
        intro={<p>Please read these terms carefully. They explain your rights and responsibilities when you use {SITE.name} devices, apps and services.</p>}
        sections={sections}
      />
    </>
  );
}
