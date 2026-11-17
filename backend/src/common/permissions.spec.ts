import { ALL_PERMISSIONS, covers } from "./permissions";

describe("covers (nobody hands out more access than they hold)", () => {
  it("an owner covers everything", () => expect(covers(ALL_PERMISSIONS, ALL_PERMISSIONS)).toBe(true));
  it("a staff manager can't hand out finance access they don't have", () => expect(covers(["staff.manage", "orders.view"], ["orders.view", "finance.view"])).toBe(false));
  it("can hand out a subset of their own access", () => expect(covers(["staff.manage", "orders.view", "customers.view"], ["orders.view"])).toBe(true));
  it("an empty role is always fine", () => expect(covers([], [])).toBe(true));
  it("can't grant staff.manage unless they hold it", () => expect(covers(["orders.view"], ["staff.manage"])).toBe(false));
});
