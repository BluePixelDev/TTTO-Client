import Game from './game';
import ServerSocket from "./util/serverSocket";
import ServerAPI from './util/serverAPI';

const lobbyWrapper = document.getElementById('lobby-wrapper') as HTMLDivElement;
const gameWrapper = document.getElementById('game-wrapper') as HTMLDivElement;

//Lobby
const lobbyPlayersContainer = document.getElementById('lobby-players-container') as HTMLDivElement;
const lobbyLeaveButton = document.getElementById('lobby-leave-button') as HTMLButtonElement;
const gameCodeText = document.getElementById('game-code') as HTMLHeadingElement;
const matchBeginButton = document.getElementById('match-begin-button') as HTMLButtonElement;

//Game
const gameCanvas = document.getElementById("game-canvas") as HTMLCanvasElement;

enum View {
    Lobby,
    Game
}
interface Player {
    id: string;
    username: string;
}

const serverSocket = new ServerSocket();
let game: Game | null = null;
let currentView = View.Lobby;

let players: Player[] = [];
let lobbyPlayerBubbles = new Map<string, string>();

gameWrapper.style.display = 'none';

const lobbyId = sessionStorage.getItem('lobbyId');
sessionStorage.removeItem('lobbyId');



//==== SOCKET EVENTS ====
//Joining to the lobby.
if (lobbyId) {
    serverSocket.socket.emit('joinLobby', { lobbyId: lobbyId })
    ServerAPI.getLobbyJoinCode(lobbyId).then(async res => {
        const data = await res.json();
        gameCodeText.innerText = data.joinCode;
    })
}

//On Lobby Join Event.
serverSocket.socket.on('onJoinLobby', (res) => {
    console.log(res)
    if (res.success) {
        console.log("Success");
    }
    else {
        document.location = import.meta.env.BASE_URL + "/";
    }
})


//==== LOBBY - BUTTONS ====
lobbyLeaveButton.addEventListener('click', () => {
    document.location = import.meta.env.BASE_URL + "/";
})

matchBeginButton.addEventListener('click', () => {
    serverSocket.socket.emit('beginGame', { lobbyId: lobbyId })
})

//When someone joins request player list.
serverSocket.socket.on('onPlayerJoinLobby', (res) => {
    serverSocket.socket.emit('getLobbyPlayers');
})
serverSocket.socket.on('onPlayerLeaveLobby', (res) => {
    serverSocket.socket.emit('getLobbyPlayers');
})

serverSocket.socket.on('onLobbyPlayers', (res) => {
    players = [];
    res.players.forEach((element: Player) => {
        players.push(element)
    });
    console.log(players);
    updateLobbyPlayerBubbles();
})
serverSocket.socket.on('onGameBegin', (res) => {
    changeView(View.Game);
    const size = res.boardSize ? res.boardSize : 12;
    game = new Game(size, gameCanvas);
})

requestAnimationFrame(renderLoop);
function renderLoop() {
    game?.render();
    requestAnimationFrame(renderLoop);
}

function changeView(view: View) {
    currentView = view;
    switch (view) {
        case View.Lobby:
            lobbyWrapper.style.display = 'block';
            gameWrapper.style.display = 'none';
            break;

        case View.Game:
            lobbyWrapper.style.display = 'none';
            gameWrapper.style.display = 'block';
            break;
    }
}

function updateLobbyPlayerBubbles() {
    lobbyPlayerBubbles.forEach((playerId, elementId) => {
        const isPlayerStillPresent = players.some(player => player.id === elementId);

        if (!isPlayerStillPresent) {
            const elementToRemove = document.getElementById(elementId);
            
            if (elementToRemove) {
                elementToRemove.remove();
            }

            lobbyPlayerBubbles.delete(playerId);
        }
    });

    players.forEach(player => {
        const elementId = player.id;

        if (!lobbyPlayerBubbles.has(player.id)) {
            var playerBubble = `
            <div class="lobby-player" id="${elementId}">
                <h2 id="${elementId}-text"></h2>
            </div>`;

            lobbyPlayersContainer.insertAdjacentHTML('beforeend', playerBubble);
            const element = document.getElementById(elementId + "-text") as HTMLHeadElement;
            element.innerText = player.username;
            lobbyPlayerBubbles.set(player.id, elementId);
        }
    });
}