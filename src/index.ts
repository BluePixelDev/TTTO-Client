import ServerAPI from "./util/serverAPI";

//Menu
const nameInput = document.getElementById('name-input') as HTMLInputElement;
const joinButton = document.getElementById('join-button') as HTMLButtonElement;
const hostButton = document.getElementById('host-button') as HTMLButtonElement;

//Menu - Code popup
const joinPopup = document.getElementById('host-popup') as HTMLDivElement;
const codePopupSubmitButton = document.getElementById('code-popup-submit-button') as HTMLButtonElement;
const codePopupCancelButton = document.getElementById('code-popup-cancel-button') as HTMLButtonElement;
const codePopupInput = document.getElementById('code-popup-input') as HTMLInputElement

let username = "";
let lobbyId = "";
let joinCode = -1;

joinPopup.style.display = 'none';

//==== MENU ====
joinButton.addEventListener('click', () => {
    username = nameInput.value;
    joinPopup.style.display = 'block'
})
//Popup
codePopupCancelButton.addEventListener('click', () => {
    joinPopup.style.display = 'none'
})
codePopupSubmitButton.addEventListener('click', () => {
    joinLobby();
})
hostButton.addEventListener('click', () => {
    username = nameInput.value;
    hostLobby();
})

async function joinLobby() {
    joinCode = parseInt(codePopupInput.value);
    sessionStorage.setItem("username", username);

    await ServerAPI.getLobbyIdFromCode(joinCode).then(async (res) => {
        const data = await res.json();
        console.log(data);
        if (data.success) {
            lobbyId = data.lobbyId;           
            sessionStorage.setItem("lobbyId", lobbyId);
            document.location = import.meta.env.BASE_URL + "/play.html";
        }
        else {
            console.log("Error, Lobby does not exists!");
            //Handle error here.
        }
    })
}

function hostLobby() {
    if (username != "") {
        sessionStorage.setItem("username", username);
        document.location = import.meta.env.BASE_URL + "/host.html";
    }
}
