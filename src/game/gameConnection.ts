import { ServerSocket } from "../util/serverSocket";

export class GameConnection {
    server = new ServerSocket();
    constructor() {
        this.server.socket.on('board-update', (data) => {
            console.log(data);
        });
        this.server.socket.emit('joined')
    }
}
