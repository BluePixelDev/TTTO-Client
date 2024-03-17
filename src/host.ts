// Importing ServerAPI from the specified location
import ServerAPI from "./util/serverAPI";

// Getting references to HTML elements for lobby size input and label
const lobbySizeRangeInput = document.getElementById('input-lobby-size') as HTMLInputElement;
const lobbySizeRangeLabel = document.getElementById('input-lobby-size-label') as HTMLLabelElement;

// Setting initial text content of the lobby size label
lobbySizeRangeLabel.innerText = lobbySizeRangeInput.value;

// Adding event listener to update label text content when input changes
lobbySizeRangeInput.addEventListener('input', () => {
    lobbySizeRangeLabel.innerText = lobbySizeRangeInput.value;
})

// Similar operations for board size input and label
const boardSizeRangeInput = document.getElementById('input-board-size') as HTMLInputElement;
const boardSizeRangeLabel = document.getElementById('input-board-size-label') as HTMLLabelElement;

boardSizeRangeLabel.innerText = boardSizeRangeInput.value;
boardSizeRangeInput.addEventListener('input', () => {
    boardSizeRangeLabel.innerText = boardSizeRangeInput.value;
})

// Similar operations for rows to win input and label
const rowsToWinRangeInput = document.getElementById('input-rows-to-win') as HTMLInputElement;
const rowsToWinRangeLabel = document.getElementById('input-rows-to-win-label') as HTMLLabelElement;

rowsToWinRangeLabel.innerText = rowsToWinRangeInput.value;
rowsToWinRangeInput.addEventListener('input', () => {
    rowsToWinRangeLabel.innerText = rowsToWinRangeInput.value;
})

// Adding event listener to host button for creating lobby
const hostButton = document.getElementById('host-button') as HTMLButtonElement;
hostButton.addEventListener('click', async () => {
    // Getting values from inputs
    const lobbySize = lobbySizeRangeInput.value;
    const boardSize = boardSizeRangeInput.value;
    const rowsToWin = rowsToWinRangeInput.value;

    // Sending request to server to create lobby
    await ServerAPI.createLobby(parseInt(lobbySize), { boardSize: boardSize, rowsToWin: rowsToWin }).then(res => {
        // Handling response from server
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
    }).then(data => {
        // Handling data returned from server
        console.log(data);
        if(data.success){
            sessionStorage.setItem('lobbyID', data.lobbyID);
            // Redirecting to play.html upon successful lobby creation
            document.location = import.meta.env.BASE_URL + "/play.html";
        }
    }); 
})