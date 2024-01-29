import { ServerAPI } from './util/serverAPI';
import { ServerSocket } from './util/serverSocket';

const serverSocket = new ServerSocket();

const errorPopup = document.getElementById('error-popup') as HTMLDivElement;

const gameCodeText = document.getElementById('game-code') as HTMLHeadingElement;
const matchBeginButton = document.getElementById('match-begin-button') as HTMLButtonElement;

const player1Text = document.getElementById('p1-text') as HTMLHeadingElement;
const player2Text = document.getElementById('p2-text') as HTMLHeadingElement;
errorPopup.style.display = 'none';

let lobbyId: string = ""; 
if(!serverSocket.username){
   // window.location.replace(`${import.meta.env.BASE_URL}/index`)
}
else{
    player1Text.innerText = serverSocket.username;
}

ServerAPI.createLobby().then(async (msg) => {
    const data = await msg.json();
    lobbyId = data.message;
    serverSocket.socket.emit('join', { lobbyId })
}).then(() => {
    ServerAPI.getLobbyJoinCode(lobbyId).then(async (msg) => {
        const data = await msg.json();
        gameCodeText.innerText = 'Game Code: ' + data.joinCode;
    });
}).catch(() => {
    errorPopup.style.display = 'block';
});

let hasPlayerJoined: boolean = false;
serverSocket.socket.on('join', (msg: any) => {
    console.log(msg);
})
serverSocket.socket.on('player-join', (data: any) => {
    hasPlayerJoined = true;
    player2Text.innerText = data.username;
})

serverSocket.socket.on('player-leave', () => {
    hasPlayerJoined = false;
    console.log("player left lobby!")
})

matchBeginButton.addEventListener('click', () => {
    if(hasPlayerJoined)
    serverSocket.socket.emit('match-begin', { lobbyId, sessionId: serverSocket.sessionId });
})

serverSocket.socket.on('match-begin', () => {
    window.location.replace(`${import.meta.env.BASE_URL}/game`)
})