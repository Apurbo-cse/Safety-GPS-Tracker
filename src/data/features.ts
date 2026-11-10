import type { FeatureCategory, FeatureItem } from "@/types";
import { slug } from "@/utils/format";

type Row = [FeatureCategory, string, string, string, string];

const rows: Row[] = [
  ["Vehicle Tracking", "Real-Time GPS Tracking", "Satellite", "See where each vehicle is, as it moves, on a single map.", "Positions are plotted on the web platform and the Android and iOS apps so owners and dispatchers share one view."],
  ["Vehicle Tracking", "Live Vehicle Location", "MapPin", "Open any vehicle to see its current address, speed and ignition state.", "Location details sit beside the map so you can act without switching screens."],
  ["Vehicle Tracking", "10-Second Location Updates", "Timer", "Frequent position refresh keeps the map close to what is happening on the road.", "A short update interval makes route lines smoother and alerts more timely."],
  ["Vehicle Tracking", "Multiple Vehicle Monitoring", "Layers", "Watch your whole fleet at once and filter by status.", "Group running, parked and offline vehicles and jump straight to the one that needs attention."],
  ["Vehicle Tracking", "Multiple Map Views", "Map", "Switch between road, satellite and hybrid style map views.", "Pick the view that makes it easiest to confirm a stop or a route."],
  ["Vehicle Tracking", "Google Street View", "Navigation", "Check the surroundings of a vehicle's last position at street level.", "Useful for confirming where a vehicle stopped or is parked."],
  ["Vehicle Tracking", "Live Traffic Updates", "Route", "Overlay current traffic conditions on the tracking map.", "Plan dispatch and anticipate delays on busy corridors."],

  ["Vehicle Security", "Remote Engine Lock", "Lock", "Cut engine power remotely if a vehicle is used without permission.", "Engine lock is issued from the app or web platform by the account owner."],
  ["Vehicle Security", "Remote Engine Unlock", "LockOpen", "Restore engine power remotely once the situation is resolved.", "Pairs with Engine Lock so control stays with the owner."],
  ["Vehicle Security", "Ignition ON/OFF Alerts", "Power", "Get notified when the engine is started or stopped.", "Spot unexpected starts outside working hours."],
  ["Vehicle Security", "Door Open Alerts", "DoorOpen", "Be told when a vehicle door is opened.", "Listed on the Premium Voice Monitoring package."],
  ["Vehicle Security", "Device Removal Alerts", "PlugZap", "Receive an alert if the tracker is disconnected from the vehicle.", "Helps detect tampering with the tracking device."],
  ["Vehicle Security", "Panic / SOS Button", "Siren", "A driver can raise an emergency alert with one press.", "The alert reaches the account owner as a notification."],
  ["Vehicle Security", "Accident Alerts", "TriangleAlert", "Be alerted when the device detects a possible accident.", "Faster awareness helps you send help sooner."],
  ["Vehicle Security", "Geo-fencing Alerts", "Fence", "Draw zones on the map and get alerts on entry or exit.", "Monitor depots, customer sites or restricted areas."],

  ["Reports & Analytics", "Daily Mileage Reports", "Gauge", "Distance travelled by each vehicle, day by day.", "Compare vehicles and spot unusual usage."],
  ["Reports & Analytics", "Travel History", "History", "Review where a vehicle has been over a selected period.", "Keep a record of trips for operations and disputes."],
  ["Reports & Analytics", "Route History Playback", "PlayCircle", "Replay a past trip on the map.", "Watch the route, stops and speed as they happened."],
  ["Reports & Analytics", "Parking Time Reports", "ParkingSquare", "See how long a vehicle was stationary and where.", "Identify long idle stops and unplanned parking."],
  ["Reports & Analytics", "Working Hour Reports", "Clock", "Track operating hours per vehicle.", "Useful for shift planning and utilisation checks."],
  ["Reports & Analytics", "Vehicle Activity Reports", "Activity", "A combined summary of trips, stops and alerts.", "One report to review a vehicle's day."],
  ["Reports & Analytics", "Fuel Monitoring", "Fuel", "Keep an eye on fuel use across the fleet.", "Helps reveal waste and unexpected consumption."],

  ["Driver Monitoring", "In-Car Voice Monitoring", "Mic", "Listen in to the vehicle cabin where the package includes it.", "Available on voice monitoring packages."],
  ["Driver Monitoring", "Live Video & Voice Monitoring", "Video", "See and hear what is happening in the vehicle live.", "Available on the Video & Voice Monitoring package."],
  ["Driver Monitoring", "Driver Details Management", "IdCard", "Store driver name, phone and licence against each vehicle.", "Know who is behind the wheel at any time."],
  ["Driver Monitoring", "Speed Violation Alerts", "Zap", "Alert when a vehicle exceeds your speed limit.", "Encourage safer driving and reduce risk."],
  ["Driver Monitoring", "Destination Alerts", "Flag", "Be notified when a vehicle reaches a set destination.", "Confirm arrivals without calling the driver."],

  ["Maintenance & Reminders", "BRTA Document Expiry Alerts", "FileText", "Reminders before vehicle registration papers expire.", "Avoid fines and downtime from lapsed documents."],
  ["Maintenance & Reminders", "Insurance Expiry Alerts", "ShieldCheck", "Reminders before insurance coverage ends.", "Renew on time and stay covered."],
  ["Maintenance & Reminders", "Engine Oil Change Reminders", "Droplets", "Know when an oil change is due.", "Regular servicing protects the engine."],
  ["Maintenance & Reminders", "Vehicle Maintenance Alerts", "Wrench", "Reminders for routine vehicle upkeep.", "Plan service visits before problems appear."],
  ["Maintenance & Reminders", "AC ON Notifications", "Snowflake", "Be told when the vehicle's AC is switched on.", "Listed on the Premium Voice Monitoring package."],

  ["Platform", "Android Application", "Smartphone", "Track and control your vehicles from an Android phone.", "Included in packages as 'Android and iOS App'."],
  ["Platform", "iOS Application", "Tablet", "Track and control your vehicles from an iPhone.", "Included in packages as 'Android and iOS App'."],
  ["Platform", "Web-Based Tracking Platform", "Monitor", "Full tracking console in any modern browser.", "No software to install."],
  ["Platform", "Email Notifications", "Mail", "Alerts delivered to your inbox.", "Keep a searchable trail of events."],
  ["Platform", "Popup Notifications", "BellRing", "Instant on-screen alerts on the platform.", "Critical events stand out immediately."],
];

const featureImages: Record<string, string> = {
  "parking-time-reports": "/img/features/parking.png",
  "multiple-vehicle-monitoring": "/img/features/cars.png",
  "live-traffic-updates": "/img/features/traffic.png",
  "live-vehicle-location": "/img/features/location.png",
  "vehicle-maintenance-alerts": "/img/features/maintenance.png",
  "engine-oil-change-reminders": "/img/features/engine.png",
  "10-second-location-updates": "/img/features/ten.png",
  "travel-history": "/img/features/route.png",
  "fuel-monitoring": "/img/features/fuel.png",
  "multiple-map-views": "/img/features/mapviews.png",
  "route-history-playback": "/img/features/playback.png",
  "google-street-view": "/img/features/streetview.png",
  "remote-engine-lock": "/img/features/engstop.png",
  "brta-document-expiry-alerts": "/img/features/brta.png",
  "android-application": "/img/features/appicon.png",
  "ios-application": "/img/features/appicon.png",
};

export const features: FeatureItem[] = rows.map(([category, title, icon, description, detail]) => ({
  id: slug(title),
  image: featureImages[slug(title)],
  category,
  title,
  icon,
  description,
  detail,
}));

export const featureCategories: FeatureCategory[] = [
  "Vehicle Tracking",
  "Vehicle Security",
  "Reports & Analytics",
  "Driver Monitoring",
  "Maintenance & Reminders",
  "Platform",
];

/** Highlights used on the home page */
export const homeFeatureIds = [
  "real-time-gps-tracking",
  "remote-engine-lock",
  "geo-fencing-alerts",
  "route-history-playback",
  "in-car-voice-monitoring",
  "speed-violation-alerts",
  "brta-document-expiry-alerts",
  "android-application",
];
