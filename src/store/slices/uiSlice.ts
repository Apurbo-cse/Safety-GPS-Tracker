import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ThemeMode = "light" | "dark";
interface UiState {
  theme: ThemeMode;
  mobileNavOpen: boolean;
  cartOpen: boolean;
  paletteOpen: boolean;
  deviceModalId: string | null;
  featureModalId: string | null;
  demoModalSolution: string | null;
}
const initialState: UiState = {
  theme: "light",
  mobileNavOpen: false, cartOpen: false, paletteOpen: false,
  deviceModalId: null, featureModalId: null, demoModalSolution: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setTheme(s, a: PayloadAction<ThemeMode>) { s.theme = a.payload; },
    setMobileNav(s, a: PayloadAction<boolean>) { s.mobileNavOpen = a.payload; },
    setPalette(s, a: PayloadAction<boolean>) { s.paletteOpen = a.payload; },
    setCartOpen(s, a: PayloadAction<boolean>) { s.cartOpen = a.payload; },
    openDeviceModal(s, a: PayloadAction<string | null>) { s.deviceModalId = a.payload; },
    openFeatureModal(s, a: PayloadAction<string | null>) { s.featureModalId = a.payload; },
    openDemoModal(s, a: PayloadAction<string | null>) { s.demoModalSolution = a.payload; },
  },
});
export const { setPalette, setTheme, setMobileNav, setCartOpen, openDeviceModal, openFeatureModal, openDemoModal } = uiSlice.actions;
export default uiSlice.reducer;
