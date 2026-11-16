/** Bangladesh's 64 districts, grouped by division. A district always belongs to exactly one division. */
export const DISTRICTS_BY_DIVISION = {
  Dhaka: ["Dhaka", "Faridpur", "Gazipur", "Gopalganj", "Kishoreganj", "Madaripur", "Manikganj", "Munshiganj", "Narayanganj", "Narsingdi", "Rajbari", "Shariatpur", "Tangail"],
  Chattogram: ["Bandarban", "Brahmanbaria", "Chandpur", "Chattogram", "Cox's Bazar", "Cumilla", "Feni", "Khagrachhari", "Lakshmipur", "Noakhali", "Rangamati"],
  Rajshahi: ["Bogura", "Chapainawabganj", "Joypurhat", "Naogaon", "Natore", "Pabna", "Rajshahi", "Sirajganj"],
  Khulna: ["Bagerhat", "Chuadanga", "Jashore", "Jhenaidah", "Khulna", "Kushtia", "Magura", "Meherpur", "Narail", "Satkhira"],
  Barishal: ["Barguna", "Barishal", "Bhola", "Jhalokati", "Patuakhali", "Pirojpur"],
  Sylhet: ["Habiganj", "Moulvibazar", "Sunamganj", "Sylhet"],
  Rangpur: ["Dinajpur", "Gaibandha", "Kurigram", "Lalmonirhat", "Nilphamari", "Panchagarh", "Rangpur", "Thakurgaon"],
  Mymensingh: ["Jamalpur", "Mymensingh", "Netrokona", "Sherpur"],
} as const;

export const DISTRICTS: string[] = Object.values(DISTRICTS_BY_DIVISION).flat().sort((a, b) => a.localeCompare(b));
const DIVISION_OF = new Map<string, string>(Object.entries(DISTRICTS_BY_DIVISION).flatMap(([div, list]) => list.map((d) => [d, div] as const)));
export const divisionOf = (district: string) => DIVISION_OF.get(district) ?? "";

/** Thanas of Dhaka's two city corporations: Dhaka North (DNCC) and Dhaka South (DSCC). */
export const THANAS = {
  DNCC: ["Adabor", "Airport", "Badda", "Banani", "Cantonment", "Dakshinkhan", "Darus Salam", "Gulshan", "Hatirjheel", "Kafrul", "Kallyanpur", "Khilkhet", "Mirpur Model", "Mohammadpur", "Pallabi", "Rampura", "Rupnagar", "Shah Ali", "Sher-e-Bangla Nagar", "Tejgaon", "Tejgaon Industrial Area", "Turag", "Uttara East", "Uttara West", "Uttarkhan", "Vatara"],
  DSCC: ["Bangshal", "Chawkbazar", "Demra", "Dhanmondi", "Gendaria", "Hazaribagh", "Jatrabari", "Kadamtali", "Kamrangirchar", "Khilgaon", "Kotwali", "Lalbagh", "Motijheel", "Mugda", "New Market", "Paltan", "Ramna", "Sabujbagh", "Shahbag", "Shahjahanpur", "Shyampur", "Sutrapur", "Wari"],
} as const;
