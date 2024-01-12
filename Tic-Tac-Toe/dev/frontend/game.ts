const gameCanvas = document.getElementById("game-canvas") as HTMLCanvasElement;
const gridSize = 10 as number;
const gridSpacing = 2 as number;

let cells = [] as Cell[][];

//==== CLASSES ====
class Vector2 {
    x: number
    y: number

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}
enum CellState {
    Empty = 0,
    Cross = 1,
    Circle = 2,
}
class Cell {
    index: Vector2
    state: CellState

    constructor(position: Vector2, state: CellState) {
        this.index = position;
        this.state = state;
    }
}

//==== SETUP ====
//-- Game setup
for (let x = 0; x < gridSize; x++) {
    cells[x] = [];
    for (let y = 0; y < gridSize; y++) {
        let pos = new Vector2(x, y);
        cells[x][y] = new Cell(pos, CellState.Empty);
    }
}

//-- Events
gameCanvas.addEventListener("click", onCellClick);
gameCanvas.addEventListener('contextmenu', (event) => event.preventDefault());

function onCellClick(event: MouseEvent) {
    const rect = gameCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left; //x position within the element.
    const y = event.clientY - rect.top;  //y position within the element.

    const cellSize = gameCanvas.width / gridSize;

    const xIndex = Math.floor(x / cellSize);
    const yIndex = Math.floor(y / cellSize);

    if(cells[xIndex][yIndex].state == CellState.Empty){
        cells[xIndex][yIndex].state = CellState.Cross;
    }
    else{
        cells[xIndex][yIndex].state = CellState.Empty;
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
            let cell = cells[x][y];
            drawCell(ctx, cell, cellWidth, cellHeight);
        }
    }
}
function drawBackground(ctx: CanvasRenderingContext2D){
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
            break;
        case CellState.Empty:
            drawEmptyCell(ctx, posX, posY, cellWidth, cellHeight);
            break;
    }
}
function drawCross(ctx: CanvasRenderingContext2D, x: number, y: number, cellWidth: number, cellHeight: number) {
    ctx.fillStyle = "black";
    ctx.fillRect(x + cellWidth / 2 - 5, y + cellHeight / 2 - 5, 10, 10);
}
function drawEmptyCell(ctx: CanvasRenderingContext2D, x: number, y: number, cellWidth: number, cellHeight: number){
    ctx.fillStyle = "white";
    ctx.fillRect(x, y, cellHeight, cellWidth);
}
//#endregion