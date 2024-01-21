import ServerConnection from './serverConnection';
const serverConnection = new ServerConnection();

const joinButton = document.getElementById("join-button") as HTMLButtonElement;
const getGamesButton = document.getElementById("get-games-button") as HTMLButtonElement;

joinButton.addEventListener('click', joinGame);
getGamesButton.addEventListener('click', createGame);

export function createGame(){
    
}
async function fetchNewGame() {
    try {       
        const response = await serverConnection.fetchServerAPI("create-game");
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

export function joinGame() {
    fetchNewGame();
    console.log("fetching data!");
}