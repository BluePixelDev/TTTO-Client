//import ServerConnection from './serverConnection';
//const serverConnection = new ServerConnection();

const siteBody = document.getElementsByTagName('body')[0];
const joinButton = document.getElementById("join-button") as HTMLButtonElement;
const getGamesButton = document.getElementById("get-games-button") as HTMLButtonElement;

joinButton.addEventListener('click', joinGame);
getGamesButton.addEventListener('click', createGame);

export function createGame(){
    
}
async function fetchNewGame() {
    /*try {       
        const response = await serverConnection.fetchServerAPI("create-game");
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }*/
}

export function joinGame() {
    fetchNewGame();
    console.log("fetching data!");
}

let colPos0 = 0;
let colPos1 = 20;
let startTime = Date.now();

requestAnimationFrame(animation);
function animation(){

    var currentTime = Date.now();
    var delta = startTime - currentTime;
    startTime = Date.now(); 
    
    colPos0 += 2 / delta;
    colPos1 += 2 / delta;

    siteBody.style.background = `linear-gradient(hsl(${colPos0}deg 50% 50%), hsl(${colPos1}deg 50% 50%))`
    requestAnimationFrame(animation);
}