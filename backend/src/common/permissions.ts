/** Everything a staff member can be allowed to do. Roles are just named sets of these. */
export const PERMISSIONS = {
  "orders.view": "See orders",
  "orders.manage": "Confirm, schedule, activate and cancel orders",
  "products.manage": "Edit products, categories, packages and stock",
  "content.manage": "Edit FAQs, home hero slides and news posts",
  "customers.view": "See the customer list",
  "messages.manage": "Read and answer messages from the Contact page",
  "finance.view": "See cost price, profit and stock value",
  "staff.manage": "Add staff and change roles and permissions",
} as const;
export type Permission = keyof typeof PERMISSIONS;
export const ALL_PERMISSIONS = Object.keys(PERMISSIONS) as Permission[];
export const isPermission = (p: string): p is Permission => p in PERMISSIONS;

export interface BuiltInRole { id: string; name: string; description: string; permissions: Permission[] }
/** Created automatically. "owner" always has every permission and can't be edited. */
export const BUILT_IN_ROLES: BuiltInRole[] = [
  { id: "owner", name: "Owner", description: "Full access, including staff and roles.", permissions: ALL_PERMISSIONS },
  { id: "manager", name: "Manager", description: "Runs the shop day to day. Can't manage staff.", permissions: ["orders.view", "orders.manage", "products.manage", "content.manage", "customers.view", "messages.manage", "finance.view"] },
  { id: "sales", name: "Sales", description: "Handles orders and customers.", permissions: ["orders.view", "orders.manage", "customers.view", "messages.manage"] },
  { id: "support", name: "Support", description: "Can look up orders and customers, not change them.", permissions: ["orders.view", "customers.view", "messages.manage"] },
  { id: "content", name: "Content editor", description: "Writes FAQs, hero slides and news.", permissions: ["content.manage"] },
  { id: "inventory", name: "Inventory", description: "Keeps products, categories and stock up to date.", permissions: ["products.manage", "orders.view"] },
];
export const OWNER_ROLE = "owner";
