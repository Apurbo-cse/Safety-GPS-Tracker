export interface Env {
  PORT: number;
  DATABASE_URL: string;
  DB_SSL: boolean;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  FRONTEND_ORIGINS: string[];
  TRUST_PROXY: boolean;
  NODE_ENV: string;
  /** bKash tokenized checkout. Empty values = bKash payment is switched off. */
  BKASH_BASE_URL: string;
  BKASH_USERNAME: string;
  BKASH_PASSWORD: string;
  BKASH_APP_KEY: string;
  BKASH_APP_SECRET: string;
  /** Public URL of this API (with /api/v1) — bKash sends the customer back to it. */
  API_PUBLIC_URL: string;
}

const flag = (v: unknown) => v === "1" || v === "true";

/** Validates and types process.env once at start-up so misconfiguration fails fast. */
export function validateEnv(raw: Record<string, unknown>): Env {
  const errors: string[] = [];
  const DATABASE_URL = String(raw.DATABASE_URL ?? "");
  if (!/^postgres(ql)?:\/\//.test(DATABASE_URL)) errors.push("DATABASE_URL must be a postgres:// connection string");

  const JWT_SECRET = String(raw.JWT_SECRET ?? "");
  if (JWT_SECRET.length < 32) errors.push("JWT_SECRET must be at least 32 characters");
  if (/change-me/i.test(JWT_SECRET) && raw.NODE_ENV === "production") errors.push("JWT_SECRET still has the example value");

  const PORT = Number(raw.PORT ?? 4000);
  if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) errors.push("PORT must be a valid port number");

  if (errors.length) throw new Error(`Invalid environment:\n - ${errors.join("\n - ")}`);

  return {
    PORT,
    DATABASE_URL,
    DB_SSL: flag(raw.DB_SSL),
    JWT_SECRET,
    JWT_EXPIRES_IN: String(raw.JWT_EXPIRES_IN ?? "7d"),
    FRONTEND_ORIGINS: String(raw.FRONTEND_ORIGINS ?? "http://localhost:3000").split(",").map((s) => s.trim()).filter(Boolean),
    TRUST_PROXY: flag(raw.TRUST_PROXY),
    NODE_ENV: String(raw.NODE_ENV ?? "development"),
    BKASH_BASE_URL: String(raw.BKASH_BASE_URL ?? "https://tokenized.sandbox.bka.sh/v1.2.0-beta").replace(/\/+$/, ""),
    BKASH_USERNAME: String(raw.BKASH_USERNAME ?? ""),
    BKASH_PASSWORD: String(raw.BKASH_PASSWORD ?? ""),
    BKASH_APP_KEY: String(raw.BKASH_APP_KEY ?? ""),
    BKASH_APP_SECRET: String(raw.BKASH_APP_SECRET ?? ""),
    API_PUBLIC_URL: String(raw.API_PUBLIC_URL ?? `http://localhost:${PORT}/api/v1`).replace(/\/+$/, ""),
  };
}
