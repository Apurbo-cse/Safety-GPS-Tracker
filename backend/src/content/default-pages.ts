/** Starting text for the legal pages, in the same format the editor produces. `{{…}}` placeholders are filled from the company details. */
export const DEFAULT_PAGES: { id: string; title: string; sort: number; content: string }[] = [
  {
    id: "privacy", title: "Privacy Policy", sort: 1,
    content: `<p>{{name}} ("we", "us") provides GPS vehicle tracking through tracking devices, a web platform and Android and iOS apps. This policy explains what information we collect when you use our service and how we handle it.</p>
<h2>Information we collect</h2>
<p>We collect only what we need to provide the tracking service:</p>
<ul><li><strong>Account details</strong> — name, mobile number, email address and billing address.</li><li><strong>Vehicle details</strong> — registration number, vehicle type, driver details you add, and document expiry dates you enter (BRTA papers, insurance).</li><li><strong>Location and device data</strong> — GPS position, speed, ignition status, alerts and trip history sent by the tracking device fitted in your vehicle.</li><li><strong>Voice or video</strong> — only on packages that include voice or video monitoring, and only when that feature is used.</li><li><strong>App and website usage</strong> — basic technical data such as device type, browser and log-in times, used to keep the service secure and working.</li></ul>
<h2>How we use your information</h2>
<ul><li>Show your vehicles' live location, history and reports in the app and on the web platform.</li><li>Send alerts you have turned on (ignition, geo-fence, speed, panic button, device removal and others).</li><li>Run commands you request, such as remote engine lock and unlock.</li><li>Send reminders for servicing, papers and insurance.</li><li>Process bills, provide customer support and improve the service.</li></ul>
<h2>Sharing your information</h2>
<p>We do <strong>not</strong> sell your personal or location data. We share it only:</p>
<ul><li>With telecom partners that carry device data over their networks, and service providers that host or support our platform, under confidentiality obligations.</li><li>With law enforcement when required by Bangladeshi law, or when you ask us to help recover a stolen vehicle.</li><li>With anyone you choose to give access to your account or vehicles.</li></ul>
<h2>How we protect data</h2>
<p>We use secure connections, access controls and limited staff access to protect your data. No system is completely secure, so please keep your password private and tell us right away if you think your account has been accessed by someone else.</p>
<h2>How long we keep data</h2>
<p>We keep location history and reports for as long as your account is active and as needed to provide reports, resolve disputes and meet legal requirements. When you close your account, we delete or anonymise your data unless the law requires us to keep it.</p>
<h2>Your choices and rights</h2>
<ul><li>View and update your account and vehicle details in the app.</li><li>Turn individual alerts and notifications on or off.</li><li>Ask us for a copy of your data, or ask us to correct or delete it.</li><li>Close your account by contacting our support team.</li></ul>
<h2>Drivers and other users</h2>
<p>If you install a tracker in a vehicle driven by someone else, you are responsible for telling the driver that the vehicle is tracked, and for following any law that applies to monitoring employees or other people.</p>
<h2>Changes to this policy</h2>
<p>We may update this policy from time to time. The "Last updated" date shows the latest version. For important changes we will notify you in the app or by email.</p>
<h2>Contact us</h2>
<p>Questions about privacy? Call {{phone}} or email {{email}}. Our office is at {{address}}.</p>`,
  },
  {
    id: "terms", title: "Terms of Service", sort: 2,
    content: `<p>Please read these terms carefully. They explain your rights and responsibilities when you use {{name}} devices, apps and services.</p>
<h2>Acceptance of terms</h2>
<p>By buying a package, installing a tracking device, or using our apps or web platform, you agree to these terms. If you are using the service for a business, you confirm that you can accept these terms on its behalf.</p>
<h2>The service</h2>
<p>{{name}} provides GPS tracking devices and software that show vehicle location, alerts, reports and, depending on the package, remote engine lock, voice monitoring or video monitoring.</p>
<p>Location accuracy and update speed depend on GPS signal, mobile network coverage and device condition. Tracking may be delayed or unavailable in areas without signal.</p>
<h2>Packages, payment and renewal</h2>
<ul><li>Each package has a one-time device price and a monthly service charge, shown on our pricing page.</li><li>Monthly charges must be paid on time to keep the service active. If a bill is unpaid, the service may be paused until payment is made.</li><li>Prices may change; we will tell you before a change applies to your account.</li></ul>
<h2>Device installation and care</h2>
<ul><li>Devices should be installed by our technicians or approved installers.</li><li>Do not remove, open or tamper with the device. Damage caused by tampering, accidents, water or unauthorised repair is not covered.</li><li>Tell us if you sell the vehicle or move the device to another vehicle.</li></ul>
<h2>Acceptable use</h2>
<p>You agree to use the service only for lawful purposes. You must not:</p>
<ul><li>Track a vehicle or person without the right or consent to do so.</li><li>Use voice or video monitoring in a way that breaks privacy laws.</li><li>Share your log-in with people who should not have access, or try to break into the platform.</li></ul>
<h2>Remote engine lock</h2>
<p>Use remote engine lock carefully. Lock a vehicle only when it is safe to do so and where permitted by law. We are not responsible for loss or injury caused by misuse of the engine lock feature.</p>
<h2>Your account</h2>
<p>You are responsible for keeping your password safe and for activity on your account. Contact us right away if you think someone else has accessed it.</p>
<h2>Limitation of liability</h2>
<p>The service helps you monitor and protect your vehicles, but it is not a guarantee against theft, accident or loss. To the extent allowed by law, our liability is limited to the service charges you paid for the month in which the issue occurred.</p>
<h2>Suspension and termination</h2>
<p>You may stop the service at any time by contacting support. We may suspend or end the service if these terms are broken or bills remain unpaid. Charges already paid are not refunded unless required by law.</p>
<h2>Governing law</h2>
<p>These terms are governed by the laws of Bangladesh. Any dispute will be handled by the courts of Dhaka.</p>
<h2>Changes and contact</h2>
<p>We may update these terms; the "Last updated" date shows the current version. Questions? Call {{phone}} or email {{email}}.</p>`,
  },
];
