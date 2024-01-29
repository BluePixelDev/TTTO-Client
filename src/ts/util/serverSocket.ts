import { io, Socket } from "socket.io-client";

export class ServerSocket {
    socket: Socket = io(`ws://${import.meta.env.VITE_SERVER_URI}:8080`)
    sessionId: string | null = sessionStorage.getItem('sessionId')
    username: string | null = sessionStorage.getItem('username')

    constructor(){
        window.addEventListener('beforeunload', () => {
            this.socket.close();
        });

        this.socket.auth = { username: this.username };
    
        if (this.sessionId) {
            this.socket.auth = { sessionId: this.sessionId, username: this.username };
            this.socket.connect();
        }
        
        this.socket.on('session', ({ sessionId }) => {
            this.socket.auth = { sessionId, username: this.username };
            sessionStorage.setItem("sessionId", sessionId);
        });
        
        
        this.socket.on("connect_error", (err: Error) => {
            console.log(`connect_error due to ${err.message}`);
        });
    } 
}