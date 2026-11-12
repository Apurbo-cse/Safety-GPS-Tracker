import { io, type Socket } from "socket.io-client";
import { API_URL, apiConfigured, getToken } from "./api";

let socket: Socket | null = null;

/** The live connection to the API (Socket.IO), opened with the saved log-in token. Returns null when the API isn't configured or nobody is logged in. */
export function connectSocket(): Socket | null {
  const token = getToken();
  if (!apiConfigured || !token) return null;
  if (socket) return socket;
  // the socket lives at the API's origin (not under /api/v1)
  socket = io(new URL(API_URL).origin, { auth: (cb) => cb({ token: getToken() ?? "" }), transports: ["websocket", "polling"], reconnectionDelayMax: 10_000 });
  return socket;
}

export function disconnectSocket() { socket?.disconnect(); socket = null; }
