import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface PricingState {
  selectedPlanId: string | null;
  compareIds: string[];
  sort: "default" | "device" | "monthly";
  maxMonthly: number | null;
}
const initialState: PricingState = { selectedPlanId: null, compareIds: [], sort: "default", maxMonthly: null };

const pricingSlice = createSlice({
  name: "pricing",
  initialState,
  reducers: {
    selectPlan(s, a: PayloadAction<string | null>) { s.selectedPlanId = a.payload; },
    toggleCompare(s, a: PayloadAction<string>) {
      s.compareIds = s.compareIds.includes(a.payload)
        ? s.compareIds.filter((i) => i !== a.payload)
        : [...s.compareIds, a.payload];
    },
    clearCompare(s) { s.compareIds = []; },
    setSort(s, a: PayloadAction<PricingState["sort"]>) { s.sort = a.payload; },
    setMaxMonthly(s, a: PayloadAction<number | null>) { s.maxMonthly = a.payload; },
  },
});
export const { selectPlan, toggleCompare, clearCompare, setSort, setMaxMonthly } = pricingSlice.actions;
export default pricingSlice.reducer;
