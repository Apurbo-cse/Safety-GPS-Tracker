import PageHero from "@/components/common/PageHero";
import LegalPage, { type LegalSection } from "@/components/legal/LegalPage";
import { SITE } from "@/lib/site";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta("Privacy Policy", "How Safety GPS Tracker collects, uses and protects your personal and vehicle data.", "/privacy");

const sections: LegalSection[] = [
  { id: "collect", title: "Information we collect", body: (<>
    <p>We collect only what we need to provide the tracking service:</p>
    <ul>
      <li><strong>Account details</strong> — name, mobile number, email address and billing address.</li>
      <li><strong>Vehicle details</strong> — registration number, vehicle type, driver details you add, and document expiry dates you enter (BRTA papers, insurance).</li>
      <li><strong>Location and device data</strong> — GPS position, speed, ignition status, alerts and trip history sent by the tracking device fitted in your vehicle.</li>
      <li><strong>Voice or video</strong> — only on packages that include voice or video monitoring, and only when that feature is used.</li>
      <li><strong>App and website usage</strong> — basic technical data such as device type, browser and log-in times, used to keep the service secure and working.</li>
    </ul>
  </>) },
  { id: "use", title: "How we use your information", body: (<ul>
    <li>Show your vehicles' live location, history and reports in the app and on the web platform.</li>
    <li>Send alerts you have turned on (ignition, geo-fence, speed, panic button, device removal and others).</li>
    <li>Run commands you request, such as remote engine lock and unlock.</li>
    <li>Send reminders for servicing, papers and insurance.</li>
    <li>Process bills, provide customer support and improve the service.</li>
  </ul>) },
  { id: "share", title: "Sharing your information", body: (<>
    <p>We do <strong>not</strong> sell your personal or location data. We share it only:</p>
    <ul>
      <li>With telecom partners that carry device data over their networks, and service providers that host or support our platform, under confidentiality obligations.</li>
      <li>With law enforcement when required by Bangladeshi law, or when you ask us to help recover a stolen vehicle.</li>
      <li>With anyone you choose to give access to your account or vehicles.</li>
    </ul>
  </>) },
  { id: "security", title: "How we protect data", body: (<p>We use secure connections, access controls and limited staff access to protect your data. No system is completely secure, so please keep your password private and tell us right away if you think your account has been accessed without permission.</p>) },
  { id: "retention", title: "How long we keep data", body: (<p>We keep location history and reports for as long as your account is active and as needed to provide reports, resolve disputes and meet legal requirements. When you close your account, we delete or anonymise your data within a reasonable time unless the law requires us to keep it.</p>) },
  { id: "rights", title: "Your choices and rights", body: (<ul>
    <li>View and update your account and vehicle details in the app.</li>
    <li>Turn individual alerts and notifications on or off.</li>
    <li>Ask us for a copy of your data, or ask us to correct or delete it.</li>
    <li>Close your account by contacting our support team.</li>
  </ul>) },
  { id: "drivers", title: "Drivers and other users", body: (<p>If you install a tracker in a vehicle driven by someone else, you are responsible for telling the driver that the vehicle is tracked, and for following any law that applies to monitoring employees or passengers — especially for voice and video monitoring.</p>) },
  { id: "changes", title: "Changes to this policy", body: (<p>We may update this policy from time to time. The &quot;Last updated&quot; date at the top shows the latest version. For important changes we will notify you in the app or by email.</p>) },
  { id: "contact", title: "Contact us", body: (<p>Questions about privacy? Call {SITE.phone} or email {SITE.email}. Our office is at {SITE.address}.</p>) },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" description="How we collect, use and protect your personal and vehicle data." />
      <LegalPage
        updated="10 November 2026"
        intro={<p>{SITE.name} (&quot;we&quot;, &quot;us&quot;) provides GPS vehicle tracking through tracking devices, a web platform and Android and iOS apps. This policy explains what information we collect when you use our service and how we handle it.</p>}
        sections={sections}
      />
    </>
  );
}
