import type { FaqItem, Testimonial } from "@/types";

export interface EnterpriseReview extends Testimonial {
  author: string;
  company: string;
  location: string;
  metric: string;
  rating: number;
}

export const testimonials: EnterpriseReview[] = [
  {
    id: "t1",
    author: "Tanvir Hasan",
    role: "Head of Supply Chain Logistics",
    company: "Apex Express Freight",
    location: "Tejgaon I/A, Dhaka",
    segment: "Inter-District Long Haul (42 Trucks)",
    quote: "Installing the ultrasonic fuel rods and Safety GPS Tracker saved our fleet over ৳185,000 every single month in prevented highway fuel theft. The 10-second refresh and route replay make dispatch arguments a thing of the past.",
    metric: "24% Fuel Waste Eliminated",
    rating: 5,
  },
  {
    id: "t2",
    author: "Dr. Farhana Chowdhury",
    role: "Private Vehicle Owner",
    company: "Private Car",
    location: "Gulshan-2, Dhaka",
    segment: "Private Toyota Harrier",
    quote: "When my driver takes the car to pick up my children, I can verify his live speed and AC status immediately. The ignition notification and remote engine lock give me complete peace of mind when the car is parked overnight.",
    metric: "100% Anti-Theft Security",
    rating: 5,
  },
  {
    id: "t3",
    author: "Mahmudul Karim",
    role: "Fleet Operations Lead",
    company: "Beximco Pharma Distribution",
    location: "Gazipur Industrial Zone",
    segment: "Cold-Chain Fleet (65 Vans)",
    quote: "The wireless Bluetooth temperature probes alert us before a refrigerated van warms up past critical thresholds. Plus, automated BRTA tax token reminders ensure our 65 delivery vans never get stalled by highway police.",
    metric: "Zero Temperature Spoilage",
    rating: 5,
  },
  {
    id: "t4",
    author: "Sabbir Ahmed",
    role: "Logistics Manager",
    company: "Daraz Delivery Hub",
    location: "Chittagong Port City",
    segment: "Courier & E-Commerce (110 Motorbikes)",
    quote: "The compact motorcycle trackers draw virtually zero battery power while parked. When a courier bike was snatched in Agrabad last month, the emergency engine immobilizer stopped the thief within 30 seconds and we recovered the bike with police.",
    metric: "Asset Recovered in <15 Mins",
    rating: 5,
  },
];

export const homeFaqs: FaqItem[] = [
  {
    q: "How fast does the GPS location update on the map?",
    a: "Safety GPS Tracker features an ultra-low latency 10-second satellite refresh rate. This ensures road turns, highway speed changes, and traffic stops are reflected accurately without lag.",
  },
  {
    q: "How does the Remote Engine Immobilizer work?",
    a: "Through your mobile app or web portal, you can tap 'Immobilize Engine'. An encrypted command is transmitted via the onboard 4G IoT relay in under 400 milliseconds to cut power to the fuel solenoid. A smart speed-latch ensures the command only executes safely when the vehicle slows down.",
  },
  {
    q: "Can I monitor fuel pilferage and diesel consumption?",
    a: "Yes. Our Fuel Monitoring Package pairs with capacitive and ultrasonic fuel sensor rods (±1% accuracy) installed in your vehicle's fuel tank, giving you instant alerts for sudden fuel drops, tank drainage, and refuel receipts.",
  },
  {
    q: "What happens if a vehicle enters cellular dead zones on remote highways?",
    a: "Our hardware uses Multi-Carrier 4G IoT SIM cards with automatic network switching across Grameenphone, Robi, and Banglalink towers. In rare instances where all networks are unreachable, internal flash memory stores up to 30,000 GPS points and uploads them automatically the moment signal returns.",
  },
  {
    q: "Do you provide doorstep installation across all 64 districts in Bangladesh?",
    a: "Yes! Our certified telematics technicians provide free doorstep installation, covert wiring, and device calibration in Dhaka, Chittagong, Sylhet, Rajshahi, Khulna, and all 64 districts.",
  },
  {
    q: "Can I track my fleet simultaneously on Android, iOS, and PC?",
    a: "Absolutely. One account gives your dispatchers and executives simultaneous multi-login access on native Android and iOS mobile apps as well as any desktop web browser.",
  },
];
