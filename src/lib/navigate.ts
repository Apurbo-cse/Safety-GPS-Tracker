/** Tell the global loader that a programmatic navigation (router.push) is starting. */
export const NAV_START_EVENT = "sgt:navigate-start";
export function announceNavigation() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(NAV_START_EVENT));
}
