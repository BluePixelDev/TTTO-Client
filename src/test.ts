import ServerAPI from "./util/serverAPI";
import ServerSocket from "./util/serverSocket";

const serverSocket = new ServerSocket();

serverSocket.socket.emit('username', { username: 'john' });

await ServerAPI.createLobby(2, { boardSize: 3, rowsToWin: 3 }).then((res) => {
    res.json().then((data) => {
        serverSocket.socket.emit('join-lobby', { lobbyID: data.lobbyID });
        serverSocket.socket.emit('join-lobby', { lobbyID: data.lobbyID });
        serverSocket.socket.emit('begin-game', { lobbyID: data.lobbyID });
    })
})



serverSocket.socket.on('join-lobby', (res) => {
    console.log(res);
})

serverSocket.socket.on('leave-lobby', (res) => {
    console.log(res);
})

serverSocket.socket.on('on-user-lobby-join', (res) => {
    console.log(res);
})

serverSocket.socket.on('on-user-lobby-leave', (res) => {
    console.log(res);
})

serverSocket.socket.on('begin-game', (res) => {
    console.log(res);
    serverSocket.socket.emit('set-cell', { cellX: 1, cellY: 0 })
    serverSocket.socket.emit('set-cell', { cellX: 1, cellY: 1 })
    serverSocket.socket.emit('set-cell', { cellX: 1, cellY: 2 })
})


serverSocket.socket.on('on-game-setup', (res) => {
    console.log(res);
})

serverSocket.socket.on('on-board-update', (res) => {
    console.log(res);
})

serverSocket.socket.on('on-turn-change', (res) => {
    if(serverSocket.socket.id === res){
        console.log("It is my turn!")
    }
})
serverSocket.socket.on('on-game-win', (res) => {
    console.log(res);
})