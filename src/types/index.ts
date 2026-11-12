export interface PricingPlan {
  id: string;
  name: string;
  devicePrice: number;
  monthlyCharge: number;
  /** Feature keys exactly as listed on the reference price list */
  features: string[];
  highlight?: string;
  image?: string;
  /** Product title shown on the package image on the company price list */
  siteTitle?: string;
  /** Source package number on the reference price list */
  sourceNo: number;
}

export type FeatureCategory =
  | "Vehicle Tracking"
  | "Vehicle Security"
  | "Reports & Analytics"
  | "Driver Monitoring"
  | "Maintenance & Reminders"
  | "Platform";

export interface FeatureItem {
  id: string;
  category: FeatureCategory;
  title: string;
  description: string;
  detail: string;
  icon: string;
  /** Real icon/image from the company website, when one exists */
  image?: string;
}

export type DeviceCategory =
  | "GPS Tracking Devices"
  | "Voice Monitoring Devices"
  | "Video & Voice Monitoring Devices"
  | "Vehicle GPS Hardware";

export interface Device {
  id: string;
  name: string;
  category: DeviceCategory;
  /** Second level of the catalogue (e.g. "Bike Trackers") */
  subcategory: string;
  visual: "tracker" | "voice" | "video" | "relay" | "sos";
  /** Main picture (first of `images`) */
  image?: string;
  /** Gallery, main picture first. Entries are /public paths or full URLs of uploaded pictures. */
  images?: string[];
  /** Product title as shown on the company price list image */
  siteTitle?: string;
  summary: string;
  specs: { label: string; value: string }[];
  features: string[];
  /** Only set where the price is verified from the reference price list */
  price?: number;
  priceNote: string;
  monthly?: number;
  planId?: string;
}

export interface Solution {
  id: string;
  image: string;
  /** Use object-contain (illustrations/cut-outs) instead of cover (photos) */
  contain?: boolean;
  title: string;
  icon: string;
  description: string;
  features: string[];
  benefits: string[];
}

export type VehicleStatus = "running" | "parked" | "offline" | "idle";

export interface Vehicle {
  id: string;
  name: string;
  plate: string;
  type: "Car" | "Truck" | "Bus" | "Motorcycle" | "CNG" | "Pickup";
  status: VehicleStatus;
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  ignition: boolean;
  lastUpdated: string;
  location: string;
  driver: { name: string; phone: string; license: string };
  todayKm: number;
  fuelPct: number;
  registration: { brta: string; insurance: string };
  // Advanced Telemetry & OBD-II Fields
  batteryVoltage?: number; // e.g. 13.8V
  engineTemp?: number; // e.g. 88°C
  satellites?: number; // e.g. 16
  gsmSignal?: number; // e.g. 94%
  engineLocked?: boolean; // remote immobilizer state
  acStatus?: boolean; // cabin AC state
  odometer?: number; // total mileage in km
  rpm?: number; // engine RPM
}

export type AlertType =
  | "speed"
  | "ignition"
  | "geofence"
  | "offline"
  | "accident"
  | "maintenance";

export interface AlertItem {
  id: string;
  type: AlertType;
  severity: "critical" | "warning" | "info";
  vehicleId: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface Testimonial {
  id: string;
  role: string;
  segment: string;
  quote: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface CartItem {
  id: string;
  kind: "plan" | "device";
  name: string;
  price: number;
  monthly?: number;
  qty: number;
}
