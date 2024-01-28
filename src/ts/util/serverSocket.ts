import { io, Socket } from "socket.io-client";
export const socket: Socket = io(`ws://${import.meta.env.VITE_SERVER_URI}:8080`);

window.addEventListener('beforeunload', () => {
    socket.close();
});

export const sessionId = sessionStorage.getItem('sessionId');
export const username = sessionStorage.getItem('username');

socket.auth = { username };

if (sessionId) {
    socket.auth = { sessionId, username };
    socket.connect();
}

socket.on('session', ({ sessionId }) => {
    socket.auth = { sessionId, username: username};
    sessionStorage.setItem("sessionId", sessionId);
});

socket.on("connect_error", (err: Error) => {
    console.log(`connect_error due to ${err.message}`);
});
