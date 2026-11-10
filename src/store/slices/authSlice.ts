import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface AuthUser {
  name: string;
  identifier: string;
  vehicleType?: string;
}
interface AuthState {
  user: AuthUser | null;
  status: "idle" | "loading";
}
const initialState: AuthState = { user: null, status: "idle" };

// Simulated auth only: no credentials are checked or stored.
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authStart(s) { s.status = "loading"; },
    loginSuccess(s, a: PayloadAction<AuthUser>) { s.user = a.payload; s.status = "idle"; },
    logout(s) { s.user = null; s.status = "idle"; },
  },
});
export const { authStart, loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
