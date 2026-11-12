import { clearToken, getToken, setToken, type ApiUser } from "@/lib/api";
import type { AppDispatch, RootState } from "./index";
import { authEnd, authReady, authStart, logout } from "./slices/authSlice";
import { resetAccount } from "./slices/accountSlice";
import { applyUser, baseApi, type QueryError } from "./apiSlice";

export type AppThunk<R = void> = (dispatch: AppDispatch, getState: () => RootState) => Promise<R>;

type Credentials = { accessToken: string; user: ApiUser };
// `track: false` keeps the token out of the RTK Query cache
const call = { track: false } as const;

/** On app start: if there's a saved token, restore the session from the server. */
export const bootstrapSession = (): AppThunk => async (dispatch) => {
  try {
    if (getToken()) applyUser(dispatch, await dispatch(baseApi.endpoints.me.initiate(undefined, { forceRefetch: true, subscribe: false })).unwrap());
  } catch (e) {
    if ((e as Partial<QueryError>).status === 401) clearToken(); // expired or deleted account
  } finally {
    dispatch(authReady());
  }
};

const startSession = (res: Credentials): AppThunk<ApiUser> => async (dispatch) => {
  dispatch(baseApi.util.resetApiState()); // nothing cached for the previous person
  setToken(res.accessToken);
  applyUser(dispatch, res.user);
  return res.user;
};

export const signIn = (identifier: string, password: string): AppThunk<ApiUser> => async (dispatch) => {
  dispatch(authStart());
  try { return await dispatch(startSession(await dispatch(baseApi.endpoints.login.initiate({ identifier, password }, call)).unwrap())); } finally { dispatch(authEnd()); }
};

export const signUp = (b: { name: string; mobile: string; email: string; password: string; vehicleType?: string }): AppThunk<ApiUser> => async (dispatch) => {
  dispatch(authStart());
  try { return await dispatch(startSession(await dispatch(baseApi.endpoints.register.initiate(b, call)).unwrap())); } finally { dispatch(authEnd()); }
};

/** Clears the session from this browser (the cart is kept). */
export const signOut = (): AppThunk => async (dispatch) => {
  clearToken();
  dispatch(logout()); dispatch(resetAccount()); dispatch(baseApi.util.resetApiState());
};

export const deleteAccount = (): AppThunk => async (dispatch) => { await dispatch(baseApi.endpoints.deleteAccount.initiate(undefined, call)).unwrap(); await dispatch(signOut()); };
