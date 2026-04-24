import { io } from "socket.io-client";

let socket = null;

// Always creates a fresh socket — never reuses a stale one
export function createSocket() {
  // Kill any existing socket first
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
  socket = io("/", { withCredentials: true, autoConnect: false });
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
}
