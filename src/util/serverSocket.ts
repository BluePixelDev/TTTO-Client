import { io, Socket } from "socket.io-client";

export default class ServerSocket {
    socket: Socket = io(`ws://${import.meta.env.VITE_SERVER_URI}:8080`)
    username: string | null = sessionStorage.getItem('username')

    constructor(){
        window.addEventListener('beforeunload', () => {
            this.socket.close();
        });

        this.socket.emit('username', { username: this.username })
        
        this.socket.on("connect_error", (err: Error) => {
            console.log(`connect_error due to ${err.message}`);
        });
    } 
}