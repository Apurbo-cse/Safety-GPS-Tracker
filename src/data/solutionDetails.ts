/** Extra, qualitative detail for each industry on /solutions (no invented statistics). */
export interface SolutionDetail {
  /** vehicles / assets this setup suits */
  suits: string[];
  /** common problem -> how tracking answers it */
  problems: { problem: string; answer: string }[];
  /** package id from data/pricing.ts */
  planId: string;
  /** one-line reason for the package */
  planWhy: string;
  /** typical setup steps */
  setup: string[];
}

export const solutionDetails: Record<string, SolutionDetail> = {
  "private-cars": {
    suits: ["Family cars", "Microbuses", "Pickups", "Rental to relatives"],
    problems: [
      { problem: "Car taken without your knowledge", answer: "Ignition alerts and live location show unexpected use at once." },
      { problem: "Theft while parked", answer: "Lock the engine remotely from the app and share the position with police." },
      { problem: "Missed paper or service dates", answer: "BRTA, insurance and oil-change reminders arrive before they lapse." },
    ],
    planId: "standard-gps", planWhy: "Voice and the full alert set for a personal vehicle.",
    setup: ["Choose a package", "Device is fitted in the car", "Open the app and add the vehicle", "Set alerts and geo-fence"],
  },
  logistics: {
    suits: ["Trucks", "Covered vans", "Pickups", "Delivery lorries"],
    problems: [
      { problem: "Customers keep asking where the delivery is", answer: "Live tracking with a 10-second refresh gives an honest arrival picture." },
      { problem: "Drivers idle or take detours", answer: "Parking time and route playback reports show every stop." },
      { problem: "Disputes over trips and distance", answer: "Daily mileage and travel history act as a record of what happened." },
    ],
    planId: "voice-gps", planWhy: "Truck tracking with voice monitoring at a low monthly charge.",
    setup: ["Choose a package per truck", "Fit the devices", "Group vehicles in one dashboard", "Review daily mileage reports"],
  },
  construction: {
    suits: ["Excavators", "Dump trucks", "Loaders", "Mixers & rollers"],
    problems: [
      { problem: "Machines leave site after hours", answer: "Geo-fence alerts fire the moment equipment crosses the boundary." },
      { problem: "Unclear machine utilisation", answer: "Working-hour reports show how long each machine actually ran." },
      { problem: "Tracker removed or cut", answer: "Device removal alerts warn you right away." },
    ],
    planId: "gps-3", planWhy: "Excavator device built for heavy equipment.",
    setup: ["Pick equipment to cover", "Fit the excavator device", "Draw the site boundary", "Track hours and service dates"],
  },
  "public-transport": {
    suits: ["Buses", "Mini-buses", "Staff shuttles", "School vans"],
    problems: [
      { problem: "Overspeeding on routes", answer: "Speed violation alerts help managers act on risky driving." },
      { problem: "Emergencies inside the vehicle", answer: "Panic button alerts reach the owner as a notification." },
      { problem: "Schedule slips", answer: "Travel history and live traffic updates support route planning." },
    ],
    planId: "video-voice", planWhy: "Live video and voice for passenger safety.",
    setup: ["Choose video & voice package", "Fit device and cabin camera", "Set speed limit", "Share live view with the safety lead"],
  },
  motorcycles: {
    suits: ["Commuter bikes", "Delivery bikes", "Rider fleets", "Rental bikes"],
    problems: [
      { problem: "Bike stolen from the street", answer: "Engine lock and live tracking improve the chance of recovery." },
      { problem: "Riders take personal trips", answer: "Route history shows where each bike went." },
      { problem: "Limited space on a bike", answer: "A compact bike device fits without much wiring." },
    ],
    planId: "gps-2", planWhy: "Bike premium device with the lowest monthly charge.",
    setup: ["Pick the bike package", "Hidden fitting on the bike", "Add rider details", "Turn on movement alerts"],
  },
  "ships-cargo": {
    suits: ["River cargo vessels", "Containers", "Trailers", "High-value consignments"],
    problems: [
      { problem: "Cargo visibility between depots", answer: "Live tracking shows movement from loading to destination." },
      { problem: "Unsure of arrival time", answer: "Destination alerts confirm arrivals without phone calls." },
      { problem: "Need proof of movement", answer: "Travel history keeps a documented trail." },
    ],
    planId: "gps-1", planWhy: "Premium device without voice for asset movement.",
    setup: ["Choose a package", "Fit the device on the unit", "Set destination points", "Review travel history"],
  },
  cng: {
    suits: ["CNG auto-rickshaws", "Easy-bikes", "Rented rickshaws", "Driver-operated three-wheelers"],
    problems: [
      { problem: "Unclear daily use by drivers", answer: "Daily mileage reports give a clear usage record." },
      { problem: "Rickshaw stolen or sub-let", answer: "Live tracking and engine alerts help recovery and oversight." },
      { problem: "No driver accountability", answer: "Store driver details against each vehicle." },
    ],
    planId: "voice-gps-2", planWhy: "Easy OBD device that is simple to fit.",
    setup: ["Choose the OBD package", "Plug-in fitting", "Add the driver", "Check mileage each day"],
  },
  "business-fleet": {
    suits: ["Mixed fleets", "Company cars", "Service vans", "Sales teams"],
    problems: [
      { problem: "Documents expire unnoticed", answer: "BRTA and insurance expiry alerts give early reminders." },
      { problem: "Many vehicles, many spreadsheets", answer: "One dashboard shows every vehicle, driver and report." },
      { problem: "Hard to review operations", answer: "Activity and working-hour reports go to managers." },
    ],
    planId: "premium-voice", planWhy: "The most complete cabin alerts across a fleet.",
    setup: ["List your vehicles", "Pick a package per vehicle type", "Add drivers and documents", "Set manager reports"],
  },
};
