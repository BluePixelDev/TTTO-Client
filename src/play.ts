// Import statements
import Game from './game';
import ServerSocket from "./util/serverSocket";
import ServerAPI from './util/serverAPI';

const gameWrapper = document.getElementById('game-wrapper') as HTMLDivElement;
const lobbyWrapper = document.getElementById('lobby-wrapper') as HTMLDivElement;

const winText = document.getElementById('win-text') as HTMLHeadElement;
const turnText = document.getElementById('turn-text') as HTMLHeadElement;

// HTML elements related to the lobby
const lobbyPlayersContainer = document.getElementById('lobby-players-container') as HTMLDivElement;
const lobbyLeaveButton = document.getElementById('lobby-leave-button') as HTMLButtonElement;
const gameCodeText = document.getElementById('game-code') as HTMLHeadingElement;
const matchBeginButton = document.getElementById('match-begin-button') as HTMLButtonElement;

// HTML element related to the game canvas
const gameCanvas = document.getElementById("game-canvas") as HTMLCanvasElement;

// Enumeration for different views
enum View {
    Lobby,
    Game
}

// Interface for player object
interface Player {
    id: string;
    username: string;
}

interface LobbyBubble {
    element: HTMLDivElement,
    textElement: HTMLHeadElement,
}

// Initialize server socket
const serverSocket = new ServerSocket();
let game: Game | null = null; // Initialize game object as null

let players: Player[] = []; // Array to store player objects
let lobbyPlayerBubbles = new Map<string, LobbyBubble>(); // Map to store lobby player bubbles

const lobbyID = sessionStorage.getItem('lobbyID');
const username = sessionStorage.getItem('username');


sessionStorage.removeItem('lobbyID');
serverSocket.socket.emit('username', { username: username });

gameWrapper.style.display = "none";
winText.innerText = "";
turnText.innerText = "";

//==== SOCKET EVENTS ====
// Joining the lobby.
if (lobbyID) {
    serverSocket.socket.emit('join-lobby', { lobbyID: lobbyID });
    ServerAPI.getLobbyJoinCode(lobbyID).then(async res => {
        const data = await res.json();
        gameCodeText.innerText = data.joinCode;
    });
}

// On Lobby Join Event.
serverSocket.socket.on('join-lobby', (res) => {
    if (res.success) {
        console.log("Success");
    } else {
        document.location = import.meta.env.BASE_URL + "/";
    }
});

//==== LOBBY - BUTTONS ====
// Event listener for leaving the lobby
lobbyLeaveButton.addEventListener('click', () => {
    document.location = import.meta.env.BASE_URL + "/";
});

// Event listener for beginning the match
matchBeginButton.addEventListener('click', () => {
    serverSocket.socket.emit('begin-game', { lobbyID: lobbyID });
});

// When someone joins, request player list.
serverSocket.socket.on('on-player-lobby-join', (res) => {
    res.users.forEach((user: { id: any; username: any; }) => {
        const player: Player = {
            id: user.id,
            username: user.username
        };
        if (!players.some(p => p.id === player.id)) {
            players.push(player);
            addLobbyBubble(player);
        }
    });
});
serverSocket.socket.on('on-player-lobby-leave', (res) => {
    res.users.forEach((user: { id: any; username: any; }) => {
        const player: Player = {
            id: user.id,
            username: user.username
        };
        const index = players.findIndex(p => p.id === player.id);
        if (index !== -1) {
            players.splice(index, 1);
            removeLobbyBubble(player);
        }
    });
});

// On game begin event
serverSocket.socket.on('begin-game', () => {
    switchView(View.Game); // Switch to the game view when the game begins
});

serverSocket.socket.on('on-game-setup', (res) => {
    const boardSize = res.boardSize ? res.boardSize : 3;
    const inRowToWin = res.inRowToWin ? res.inRowToWin : 3;
    game = new Game(gameCanvas, serverSocket, boardSize, inRowToWin);
});

serverSocket.socket.on('on-game-win', (res) => {
    if(res.winnerID){
        if(serverSocket.socket.id === res.winnerID){
            winText.innerText = "You've won!"
        }else{
            winText.innerText = "You've lost!"
        }
    }
})

serverSocket.socket.on('on-turn-change', (res) => {
    if(res.playerID === serverSocket.socket.id){
        turnText.innerText = "It's your turn!"
    }
    else{
        turnText.innerText = `It's ${res.playerUsername}'s turn!`
    }
})

// Request animation frame for rendering loop
requestAnimationFrame(renderLoop);
function renderLoop() {
    game?.render(); // Render the game
    requestAnimationFrame(renderLoop);
}

// Update lobby player bubbles based on the players' presence
function addLobbyBubble(player: Player) {
    const elementID = player.id;

    if (!lobbyPlayerBubbles.has(player.id)) {
        var playerBubble = `
            <div class="lobby-player" id="${elementID}">
                <h2 id="${elementID}-text"></h2>
            </div>`;

        lobbyPlayersContainer.insertAdjacentHTML('beforeend', playerBubble);
        const element = document.getElementById(elementID) as HTMLDivElement;
        const textElement = document.getElementById(elementID + "-text") as HTMLDivElement;
        element.innerText = player.username;
        lobbyPlayerBubbles.set(player.id, {
            element: element,
            textElement: textElement,
        });
    }
}

function removeLobbyBubble(player: Player) {
    if (lobbyPlayerBubbles.has(player.id)) {
        const bubble = lobbyPlayerBubbles.get(player.id);
        bubble?.element.remove()
    }
}

// Function to switch views between lobby and game
function switchView(view: View) {
    switch (view) {
        case View.Lobby:
            // Show lobby related elements
            gameWrapper.style.display = 'none';
            lobbyWrapper.style.display = 'block';
            lobbyPlayersContainer.style.display = 'block';
            lobbyLeaveButton.style.display = 'block';
            gameCanvas.style.display = 'none'; // Hide game canvas
            break;
        case View.Game:
            // Show game related elements
            gameWrapper.style.display = 'block';
            lobbyWrapper.style.display = 'none';
            lobbyPlayersContainer.style.display = 'none'; // Hide lobby player container
            lobbyLeaveButton.style.display = 'none'; // Hide lobby leave button
            gameCanvas.style.display = 'block'; // Show game canvas
            break;
    }
}