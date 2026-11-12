import type { Request } from "express";

/** Public origin of this API as the caller sees it (correct behind a proxy when TRUST_PROXY=1). */
export const baseUrl = (req: Request) => `${req.protocol}://${req.get("host")}`;
