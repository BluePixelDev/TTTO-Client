import { ServerAPI } from './util/serverAPI';
import { sessionId, socket, username } from './util/serverSocket';

const gameCodeText = document.getElementById('game-code') as HTMLHeadingElement;
const matchBeginButton = document.getElementById('match-begin-button') as HTMLButtonElement;

const player1Text = document.getElementById('p1-text') as HTMLHeadingElement;
const player2Text = document.getElementById('p2-text') as HTMLHeadingElement;

let lobbyId: string = ""; 
let joinCode: number | null = sessionStorage.getItem('join-code') as number | null;
let isHosting: boolean | null = sessionStorage.getItem('isHosting') as boolean | null;

if(!username){
    window.location.replace(`${import.meta.env.BASE_URL}/index`)
}
else{
    player1Text.innerText = username;
}

if(!joinCode){
    if(isHosting){
        ServerAPI.createLobby().then(async (msg) => {
            const data = await msg.json();
            lobbyId = data.message;
            socket.emit('join', { lobbyId })
        }).then(() => {
            ServerAPI.getLobbyJoinCode(lobbyId).then(async (msg) => {
                const data = await msg.json();
                gameCodeText.innerText = 'Game Code: ' + data.joinCode;
            });
        })
    }
}
else{
    sessionStorage.removeItem('join-code');
    ServerAPI.getLobbyIdFromCode(joinCode).then(async (msg) => {
        const data = await msg.json();
        gameCodeText.innerText = 'Game Code: ' + data.lobbyId;
        socket.emit('join', { lobbyId: data.lobbyId })
    });
}

let hasPlayerJoined: boolean = false;
socket.on('join', (msg) => {
    console.log(msg);
})
socket.on('player-join', (data) => {
    hasPlayerJoined = true;
    player2Text.innerText = data.username;
})

socket.on('player-leave', () => {
    hasPlayerJoined = false;
    console.log("player left lobby!")
})

matchBeginButton.addEventListener('click', () => {
    if(hasPlayerJoined)
    socket.emit('match-begin', { lobbyId, sessionId });
})

socket.on('match-begin', () => {
    window.location.replace(`${import.meta.env.BASE_URL}/game`)
})