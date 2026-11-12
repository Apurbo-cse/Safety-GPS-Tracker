export const ALERT_KEYS = ["ignition", "geofence", "speed", "tamper", "sos", "documents", "billing"] as const;
export const CHANNEL_KEYS = ["push", "sms", "email"] as const;
export type AlertKey = (typeof ALERT_KEYS)[number];
export type ChannelKey = (typeof CHANNEL_KEYS)[number];

export interface UserSettings {
  alerts: Record<AlertKey, boolean>;
  channels: Record<ChannelKey, boolean>;
  speedLimit: number;
  language: "en" | "bn";
  units: "km" | "mi";
  twoFactor: boolean;
  marketing: boolean;
}

export const defaultSettings: UserSettings = {
  alerts: { ignition: true, geofence: true, speed: true, tamper: true, sos: true, documents: true, billing: true },
  channels: { push: true, sms: true, email: false },
  speedLimit: 80,
  language: "en",
  units: "km",
  twoFactor: false,
  marketing: false,
};

/** Merge stored settings over the defaults so new keys always exist. */
export const withDefaults = (s?: Partial<UserSettings> | null): UserSettings => ({
  ...defaultSettings,
  ...(s ?? {}),
  alerts: { ...defaultSettings.alerts, ...(s?.alerts ?? {}) },
  channels: { ...defaultSettings.channels, ...(s?.channels ?? {}) },
});
