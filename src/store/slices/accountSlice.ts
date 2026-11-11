import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Profile {
  name: string;
  phone: string;
  email: string;
  company: string;
  address: string;
  division: string;
}

export type AlertKey = "ignition" | "geofence" | "speed" | "tamper" | "sos" | "documents" | "billing";
export type Channel = "push" | "sms" | "email";

export interface Settings {
  alerts: Record<AlertKey, boolean>;
  channels: Record<Channel, boolean>;
  speedLimit: number;
  language: "en" | "bn";
  units: "km" | "mi";
  twoFactor: boolean;
  marketing: boolean;
}

interface AccountState { profile: Profile; settings: Settings }

export const defaultSettings: Settings = {
  alerts: { ignition: true, geofence: true, speed: true, tamper: true, sos: true, documents: true, billing: true },
  channels: { push: true, sms: true, email: false },
  speedLimit: 80,
  language: "en",
  units: "km",
  twoFactor: false,
  marketing: false,
};

const initialState: AccountState = {
  profile: { name: "", phone: "", email: "", company: "", address: "", division: "Dhaka" },
  settings: defaultSettings,
};

/** Demo profile & preferences — saved in this browser only (see StoreProvider). */
const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    hydrateAccount(s, a: PayloadAction<Partial<AccountState>>) {
      if (a.payload.profile) s.profile = { ...s.profile, ...a.payload.profile };
      if (a.payload.settings) s.settings = { ...defaultSettings, ...a.payload.settings, alerts: { ...defaultSettings.alerts, ...a.payload.settings.alerts }, channels: { ...defaultSettings.channels, ...a.payload.settings.channels } };
    },
    updateProfile(s, a: PayloadAction<Partial<Profile>>) { s.profile = { ...s.profile, ...a.payload }; },
    updateSettings(s, a: PayloadAction<Partial<Settings>>) { s.settings = { ...s.settings, ...a.payload }; },
    toggleAlert(s, a: PayloadAction<AlertKey>) { s.settings.alerts[a.payload] = !s.settings.alerts[a.payload]; },
    toggleChannel(s, a: PayloadAction<Channel>) { s.settings.channels[a.payload] = !s.settings.channels[a.payload]; },
    resetSettings(s) { s.settings = defaultSettings; },
  },
});

export const { hydrateAccount, updateProfile, updateSettings, toggleAlert, toggleChannel, resetSettings } = accountSlice.actions;
export default accountSlice.reducer;
