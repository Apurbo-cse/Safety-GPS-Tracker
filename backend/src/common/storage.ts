import { resolve } from "node:path";

/**
 * The one folder on the server where every file lives.
 *   <STORAGE_DIR>/img/…     site pictures (hero, logos, products) — served at /api/v1/assets/img/…
 *   <STORAGE_DIR>/media/<id> pictures uploaded in the admin panel   — served at /api/v1/media/<id>
 * Defaults to ./storage next to where the API is started. On a host with a disk or volume, point STORAGE_DIR at it.
 */
export const storageDir = () => resolve(process.env.STORAGE_DIR || "storage");
