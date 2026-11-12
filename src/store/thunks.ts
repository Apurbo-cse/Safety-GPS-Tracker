import { api, ApiError, clearToken, getToken, setToken, type ApiOrder, type ApiSettings, type ApiUser, type CreateOrderBody } from "@/lib/api";
import type { AppDispatch, RootState } from "./index";
import { authEnd, authReady, authStart, loginSuccess, logout } from "./slices/authSlice";
import { hydrateAccount, resetAccount } from "./slices/accountSlice";
import { addOrder, clearOrders, ordersFailed, ordersLoading, replaceOrder, setOrders } from "./slices/ordersSlice";
import { clearCart } from "./slices/cartSlice";

export type AppThunk<R = void> = (dispatch: AppDispatch, getState: () => RootState) => Promise<R>;

const applyUser = (dispatch: AppDispatch, u: ApiUser) => {
  dispatch(loginSuccess({ id: u.id, name: u.name, email: u.email, phone: u.phone, role: u.role, vehicleType: u.vehicleType }));
  dispatch(hydrateAccount(u));
};

export const loadOrders = (): AppThunk => async (dispatch) => {
  dispatch(ordersLoading());
  try { dispatch(setOrders(await api.orders())); } catch { dispatch(ordersFailed()); }
};

/** On app start: if there's a saved token, restore the session from the server. */
export const bootstrapSession = (): AppThunk => async (dispatch) => {
  try {
    if (getToken()) {
      applyUser(dispatch, await api.me());
      void dispatch(loadOrders());
    }
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) clearToken(); // expired or deleted account
  } finally {
    dispatch(authReady());
  }
};

const startSession = (res: { accessToken: string; user: ApiUser }): AppThunk<ApiUser> => async (dispatch) => {
  setToken(res.accessToken);
  applyUser(dispatch, res.user);
  void dispatch(loadOrders());
  return res.user;
};

export const signIn = (identifier: string, password: string): AppThunk<ApiUser> => async (dispatch) => {
  dispatch(authStart());
  try { return await dispatch(startSession(await api.login({ identifier, password }))); } finally { dispatch(authEnd()); }
};

export const signUp = (b: Parameters<typeof api.register>[0]): AppThunk<ApiUser> => async (dispatch) => {
  dispatch(authStart());
  try { return await dispatch(startSession(await api.register(b))); } finally { dispatch(authEnd()); }
};

/** Clears the session from this browser (the cart is kept). */
export const signOut = (): AppThunk => async (dispatch) => {
  clearToken();
  dispatch(logout()); dispatch(clearOrders()); dispatch(resetAccount());
};

export const saveProfile = (b: Parameters<typeof api.updateProfile>[0]): AppThunk => async (dispatch) => {
  const u = await api.updateProfile(b);
  applyUser(dispatch, u);
};

export const saveSettings = (s: ApiSettings): AppThunk => async () => { await api.updateSettings(s); };

export const submitOrder = (b: CreateOrderBody): AppThunk<ApiOrder> => async (dispatch) => {
  const order = await api.createOrder(b);
  dispatch(addOrder(order));
  dispatch(clearCart());
  return order;
};

export const cancelOrder = (id: string): AppThunk => async (dispatch) => { dispatch(replaceOrder(await api.cancelOrder(id))); };

export const deleteAccount = (): AppThunk => async (dispatch) => { await api.deleteAccount(); await dispatch(signOut()); };
