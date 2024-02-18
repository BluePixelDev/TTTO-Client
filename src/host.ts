import ServerAPI from "./util/serverAPI";

const lobbySizeRangeInput = document.getElementById('input-lobby-size') as HTMLInputElement;
const lobbySizeRangeLabel = document.getElementById('input-lobby-size-label') as HTMLLabelElement;

lobbySizeRangeLabel.innerText = lobbySizeRangeInput.value;
lobbySizeRangeInput.addEventListener('input', () => {
    lobbySizeRangeLabel.innerText = lobbySizeRangeInput.value;
})

const boardSizeRangeInput = document.getElementById('input-board-size') as HTMLInputElement;
const boardSizeRangeLabel = document.getElementById('input-board-size-label') as HTMLLabelElement;

boardSizeRangeLabel.innerText = boardSizeRangeInput.value;
boardSizeRangeInput.addEventListener('input', () => {
    boardSizeRangeLabel.innerText = boardSizeRangeInput.value;
})

const rowsToWinRangeInput = document.getElementById('input-rows-to-win') as HTMLInputElement;
const rowsToWinRangeLabel = document.getElementById('input-rows-to-win-label') as HTMLLabelElement;

rowsToWinRangeLabel.innerText = rowsToWinRangeInput.value;
rowsToWinRangeInput.addEventListener('input', () => {
    rowsToWinRangeLabel.innerText = rowsToWinRangeInput.value;
})

const hostButton = document.getElementById('host-button') as HTMLButtonElement;
hostButton.addEventListener('click', async () => {

    const lobbySize = lobbySizeRangeInput.value;
    const boardSize = boardSizeRangeInput.value;
    const rowsToWin = rowsToWinRangeInput.value;

    await ServerAPI.createLobby(parseInt(lobbySize), { boardSize: boardSize, rowsToWin: rowsToWin }).then(res => {
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
        return res.json();
    }).then(data => {
        console.log(data);
        if(data.success){
            sessionStorage.setItem('lobbyId', data.lobbyId);
            document.location = import.meta.env.BASE_URL + "/play.html";
        }
    }); 
})
