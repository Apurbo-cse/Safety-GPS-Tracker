import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "customer" | "admin";
  vehicleType: string | null;
  staffRoleId: string | null;
  /** What this person may do in the admin panel (empty for customers). */
  permissions: string[];
}
interface AuthState {
  user: AuthUser | null;
  status: "idle" | "loading";
  /** false until the saved session (if any) has been checked with the server — avoids a "logged out" flash. */
  ready: boolean;
}
const initialState: AuthState = { user: null, status: "idle", ready: false };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authStart(s) { s.status = "loading"; },
    authEnd(s) { s.status = "idle"; },
    loginSuccess(s, a: PayloadAction<AuthUser>) { s.user = a.payload; s.status = "idle"; },
    logout(s) { s.user = null; s.status = "idle"; },
    authReady(s) { s.ready = true; },
  },
});
export const { authStart, authEnd, loginSuccess, logout, authReady } = authSlice.actions;
export default authSlice.reducer;
