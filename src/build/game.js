"use strict";
const ws = new WebSocket('ws://localhost:8080');
const gameCanvas = document.getElementById("game-canvas");
const gridSize = 20;
const gridSpacing = 2;
const countInLineToWin = 5;
let cells = [];
class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
var CellState;
(function (CellState) {
    CellState[CellState["Empty"] = 0] = "Empty";
    CellState[CellState["Cross"] = 1] = "Cross";
    CellState[CellState["Circle"] = 2] = "Circle";
})(CellState || (CellState = {}));
class Cell {
    constructor(position, state) {
        this.index = position;
        this.state = state;
        this.player_id = "";
    }
}
gameCanvas.addEventListener("click", onCellClick);
gameCanvas.addEventListener('contextmenu', (event) => event.preventDefault());
ws.addEventListener("open", () => {
    console.log("Connected!");
    ws.send("Hello!");
});
setupGame();
function setupGame() {
    for (let x = 0; x < gridSize; x++) {
        cells[x] = [];
        for (let y = 0; y < gridSize; y++) {
            let pos = new Vector2(x, y);
            cells[x][y] = new Cell(pos, CellState.Empty);
        }
    }
}
requestAnimationFrame(gameLoop);
function gameLoop() {
    updateLoop();
    drawLoop();
    requestAnimationFrame(gameLoop);
}
function updateLoop() {
}
function drawLoop() {
    const ctx = gameCanvas.getContext('2d');
    const size = gameCanvas.offsetWidth;
    gameCanvas.style.width = `${size}px`;
    gameCanvas.style.height = `${size}px`;
    const scale = window.devicePixelRatio;
    gameCanvas.width = Math.floor(size * scale);
    gameCanvas.height = Math.floor(size * scale);
    if (ctx == null)
        return;
    ctx.scale(scale, scale);
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    drawBackground(ctx);
    drawCells(ctx);
}
function drawCells(ctx) {
    const cellWidth = (gameCanvas.width - gridSize * gridSpacing - gridSpacing) / gridSize;
    const cellHeight = (gameCanvas.height - gridSize * gridSpacing - gridSpacing) / gridSize;
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            let cell = cells[x][y];
            drawCell(ctx, cell, cellWidth, cellHeight);
        }
    }
}
function drawBackground(ctx) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
}
function drawCell(ctx, cell, cellWidth, cellHeight) {
    let posX = (cellWidth + gridSpacing) * cell.index.x + gridSpacing;
    let posY = (cellHeight + gridSpacing) * cell.index.y + gridSpacing;
    switch (cell.state) {
        case CellState.Cross:
            drawEmptyCell(ctx, posX, posY, cellWidth, cellHeight);
            drawCross(ctx, posX, posY, cellWidth, cellHeight);
            break;
        case CellState.Circle:
            drawCircle(ctx, posX, posY, cellWidth, cellHeight);
            break;
        case CellState.Empty:
            drawEmptyCell(ctx, posX, posY, cellWidth, cellHeight);
            break;
    }
}
function drawCross(ctx, x, y, cellWidth, cellHeight) {
    ctx.fillStyle = "red";
    ctx.fillRect(x, y, cellWidth, cellHeight);
}
function drawCircle(ctx, x, y, cellWidth, cellHeight) {
    ctx.fillStyle = "green";
    ctx.fillRect(x, y, cellWidth, cellHeight);
}
function drawEmptyCell(ctx, x, y, cellWidth, cellHeight) {
    ctx.fillStyle = "white";
    ctx.fillRect(x, y, cellHeight, cellWidth);
}
function onCellClick(event) {
    const rect = gameCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    clickOnCell(x, y);
    checkForWin();
}
function clickOnCell(posX, posY) {
    const cellSize = gameCanvas.width / gridSize;
    const xIndex = Math.floor(posX / cellSize);
    const yIndex = Math.floor(posY / cellSize);
    if (cells[xIndex][yIndex].state == CellState.Empty) {
        cells[xIndex][yIndex].state = CellState.Cross;
    }
    else {
        if (cells[xIndex][yIndex].state == CellState.Circle) {
            cells[xIndex][yIndex].state = CellState.Empty;
        }
        if (cells[xIndex][yIndex].state == CellState.Cross) {
            cells[xIndex][yIndex].state = CellState.Circle;
        }
    }
}
function checkForWin() {
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            const cell = cells[x][y];
            let check = checkCellsNeighbours(cell);
            if (check) {
                console.log("Someone scored! " + cell.state);
            }
        }
    }
}
function checkCellsNeighbours(cell) {
    if (cell.state == CellState.Empty) {
        return false;
    }
    let up = checkCellsInDirection(0, -1, cell);
    let upLeft = checkCellsInDirection(-1, -1, cell);
    let upRight = checkCellsInDirection(1, -1, cell);
    let upCheck = up || upLeft || upRight;
    let left = checkCellsInDirection(-1, 0, cell);
    let right = checkCellsInDirection(-1, 0, cell);
    let sidewaysCheck = left || right;
    let down = checkCellsInDirection(0, 1, cell);
    let downLeft = checkCellsInDirection(-1, 1, cell);
    let downRight = checkCellsInDirection(1, 1, cell);
    let downCheck = down || downLeft || downRight;
    return upCheck || sidewaysCheck || downCheck;
}
function checkCellsInDirection(dirX, dirY, cell) {
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
        let nextCell = cells[posX][posY];
        if (nextCell.state != CellState.Empty) {
            if (nextCell.state == cell.state) {
                countInLine++;
                continue;
            }
        }
        countInLine = 0;
    }
    return countInLine >= countInLineToWin;
}
