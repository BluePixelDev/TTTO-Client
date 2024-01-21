const gameCanvas = document.getElementById("game-canvas") as HTMLCanvasElement;
const saveButton = document.getElementById("save-button") as HTMLButtonElement;
const clearButton = document.getElementById("clear-button") as HTMLButtonElement;

const gridSize = 20 as number;
const gridSpacing = 2 as number;
const countInLineToWin = 5 as number;

let cellData = [] as Cell[][];

//#region CLASSES 
class Vector2 {
    x: number
    y: number

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

enum CellState {
    Empty = "Empty",
    Cross = "Cross",
    Circle = "Circle",
}

class Cell {
    index: Vector2
    state: CellState
    player_id: string

    constructor(position: Vector2, state: CellState) {
        this.index = position;
        this.state = state;
        this.player_id = "";
    }
}
//#endregion

//==== INIT ====
saveButton.addEventListener('click', saveGame);
clearButton.addEventListener('click', clearBoard);
gameCanvas.addEventListener("click", onCellClick);

gameCanvas.addEventListener('contextmenu', (event) => event.preventDefault());

setupGame();

function setupGame() {
    for (let x = 0; x < gridSize; x++) {
        cellData[x] = [];
        for (let y = 0; y < gridSize; y++) {
            let pos = new Vector2(x, y);
            cellData[x][y] = new Cell(pos, CellState.Empty);
        }
    }
    loadGame();
}
function saveGame(){
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
           localStorage.setItem(`${x}:${y}`, cellData[x][y].state.toString())
        }
    }
}
function loadGame(){ 
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            var value = localStorage.getItem(`${x}:${y}`);
            if(value != null){
                let state : CellState | undefined = stringToEnum(CellState, value);

                if(state != undefined){
                    cellData[x][y].state = state;
                }
                
            }    
        }
    } 
}
function stringToEnum<T>(enumObj: T, value: string): T[keyof T] | undefined {
    return (enumObj as any)[value] as T[keyof T] | undefined;
}
function clearBoard(){
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            cellData[x][y].state = CellState.Empty;
        }
    }
}

//==== MAIN LOOP ====
requestAnimationFrame(gameLoop);
function gameLoop() {

    updateLoop();
    drawLoop();
    requestAnimationFrame(gameLoop);
}

//#region Updating
function updateLoop() {
}
//#endregion

//#region Drawing
function drawLoop() {
    const ctx = gameCanvas.getContext('2d');

    const size = gameCanvas.offsetWidth;
    gameCanvas.style.width = `${size}px`;
    gameCanvas.style.height = `${size}px`;

    // Set actual size in memory (scaled to account for extra pixel density).
    const scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.
    gameCanvas.width = Math.floor(size * scale);
    gameCanvas.height = Math.floor(size * scale);

    if (ctx == null) return;

    // Normalize coordinate system to use CSS pixels.
    ctx.scale(scale, scale);

    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    drawBackground(ctx);
    drawCells(ctx);
}
function drawCells(ctx: CanvasRenderingContext2D) {
    const cellWidth = (gameCanvas.width - gridSize * gridSpacing - gridSpacing) / gridSize;
    const cellHeight = (gameCanvas.height - gridSize * gridSpacing - gridSpacing) / gridSize;

    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            let cell = cellData[x][y];
            drawCell(ctx, cell, cellWidth, cellHeight);
        }
    }
}
function drawBackground(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
}
function drawCell(ctx: CanvasRenderingContext2D, cell: Cell, cellWidth: number, cellHeight: number) {
    let posX = (cellWidth + gridSpacing) * cell.index.x + gridSpacing;
    let posY = (cellHeight + gridSpacing) * cell.index.y + gridSpacing;

    switch (cell.state) {
        case CellState.Cross:
            drawEmptyCell(ctx, posX, posY, cellWidth, cellHeight);
            drawCross(ctx, posX, posY, cellWidth, cellHeight);
            break;
        case CellState.Circle:
            drawCircle(ctx, posX, posY, cellWidth, cellHeight)
            break;
        case CellState.Empty:
            drawEmptyCell(ctx, posX, posY, cellWidth, cellHeight);
            break;
    }
}
function drawCross(ctx: CanvasRenderingContext2D, x: number, y: number, cellWidth: number, cellHeight: number) {
    ctx.fillStyle = "red";
    ctx.fillRect(x, y, cellWidth, cellHeight);
}
function drawCircle(ctx: CanvasRenderingContext2D, x: number, y: number, cellWidth: number, cellHeight: number) {
    ctx.fillStyle = "green";
    ctx.fillRect(x, y, cellWidth, cellHeight);
}
function drawEmptyCell(ctx: CanvasRenderingContext2D, x: number, y: number, cellWidth: number, cellHeight: number) {
    ctx.fillStyle = "white";
    ctx.fillRect(x, y, cellHeight, cellWidth);
}
//#endregion

//==== EVENTS ====
function onCellClick(event: MouseEvent) {
    const rect = gameCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left; //x position within the element.
    const y = event.clientY - rect.top;  //y position within the element.
    clickOnCell(x, y);
    checkForWin();
}

function clickOnCell(posX: number, posY: number) {
    const cellSize = gameCanvas.width / gridSize;
    const xIndex = Math.floor(posX / cellSize);
    const yIndex = Math.floor(posY / cellSize);

    if (cellData[xIndex][yIndex].state == CellState.Empty) {
        cellData[xIndex][yIndex].state = CellState.Cross;
    }
    else {
        if (cellData[xIndex][yIndex].state == CellState.Circle) {
            cellData[xIndex][yIndex].state = CellState.Empty;
        }
        if (cellData[xIndex][yIndex].state == CellState.Cross) {
            cellData[xIndex][yIndex].state = CellState.Circle;
        }
    }
}
function checkForWin() {
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            const cell = cellData[x][y];
            let check = checkCellsNeighbours(cell);

            if (check) {
                console.log("Someone scored! " + cell.state);
            }
        }
    }
}
function checkCellsNeighbours(cell: Cell): Boolean {

    if (cell.state == CellState.Empty) {
        return false
    }

    let up = checkCellsInDirection(0, -1, cell)
    let upLeft = checkCellsInDirection(-1, -1, cell)
    let upRight = checkCellsInDirection(1, -1, cell)
    let upCheck = up || upLeft || upRight;

    let left = checkCellsInDirection(-1, 0, cell)
    let right = checkCellsInDirection(-1, 0, cell)
    let sidewaysCheck = left || right;

    let down = checkCellsInDirection(0, 1, cell)
    let downLeft = checkCellsInDirection(-1, 1, cell)
    let downRight = checkCellsInDirection(1, 1, cell)
    let downCheck = down || downLeft || downRight;

    return upCheck || sidewaysCheck || downCheck;
}
function checkCellsInDirection(dirX: number, dirY: number, cell: Cell): Boolean {
    let countInLine = 0;
    for (let i = 0; i < countInLineToWin; i++) {
        let posX = cell.index.x + dirX * i;
        let posY = cell.index.y + dirY * i;

        if (posX >= gridSize) {
            break;
        }
        if (posX < 0) {
            break;
        }

        if (posY >= gridSize) {
            break;
        }
        if (posY < 0) {
            break;
        }

        let nextCell = cellData[posX][posY];
        if (nextCell.state != CellState.Empty) {
            if (nextCell.state == cell.state) {
                countInLine++;

                continue;
            }
        }

        countInLine = 0;
    }
    return countInLine >= countInLineToWin
}