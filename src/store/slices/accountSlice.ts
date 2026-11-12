import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ApiSettings, ApiUser } from "@/lib/api";

export interface Profile { name: string; phone: string; email: string; company: string; address: string; division: string }
export type Settings = ApiSettings;
export type AlertKey = keyof Settings["alerts"];
export type Channel = keyof Settings["channels"];

interface AccountState { profile: Profile; settings: Settings; loaded: boolean }

export const defaultSettings: Settings = {
  alerts: { ignition: true, geofence: true, speed: true, tamper: true, sos: true, documents: true, billing: true },
  channels: { push: true, sms: true, email: false },
  speedLimit: 80, language: "en", units: "km", twoFactor: false, marketing: false,
};
const emptyProfile: Profile = { name: "", phone: "", email: "", company: "", address: "", division: "Dhaka" };
const initialState: AccountState = { profile: emptyProfile, settings: defaultSettings, loaded: false };

/** Profile and settings live in the database; this is the signed-in user's copy. */
const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    hydrateAccount(s, a: PayloadAction<ApiUser>) {
      const u = a.payload;
      s.profile = { name: u.name, phone: u.phone ?? "", email: u.email, company: u.company, address: u.address, division: u.division };
      s.settings = u.settings;
      s.loaded = true;
    },
    toggleAlert(s, a: PayloadAction<AlertKey>) { s.settings.alerts[a.payload] = !s.settings.alerts[a.payload]; },
    toggleChannel(s, a: PayloadAction<Channel>) { s.settings.channels[a.payload] = !s.settings.channels[a.payload]; },
    updateSettings(s, a: PayloadAction<Partial<Settings>>) { s.settings = { ...s.settings, ...a.payload }; },
    resetSettings(s) { s.settings = defaultSettings; },
    resetAccount() { return initialState; },
  },
});

export const { hydrateAccount, toggleAlert, toggleChannel, updateSettings, resetSettings, resetAccount } = accountSlice.actions;
export default accountSlice.reducer;
