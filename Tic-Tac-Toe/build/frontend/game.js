var gameCanvas = document.getElementById("game-canvas");
var gridSize = 10;
var gridSpacing = 2;
var cells = [];
//==== CLASSES ====
var Vector2 = /** @class */ (function () {
    function Vector2(x, y) {
        this.x = x;
        this.y = y;
    }
    return Vector2;
}());
var CellState;
(function (CellState) {
    CellState[CellState["Empty"] = 0] = "Empty";
    CellState[CellState["Cross"] = 1] = "Cross";
    CellState[CellState["Circle"] = 2] = "Circle";
})(CellState || (CellState = {}));
var Cell = /** @class */ (function () {
    function Cell(position, state) {
        this.index = position;
        this.state = state;
    }
    return Cell;
}());
//==== SETUP ====
//-- Game setup
for (var x = 0; x < gridSize; x++) {
    cells[x] = [];
    for (var y = 0; y < gridSize; y++) {
        var pos = new Vector2(x, y);
        cells[x][y] = new Cell(pos, CellState.Empty);
    }
}
//-- Events
gameCanvas.addEventListener("click", onCellClick);
gameCanvas.addEventListener('contextmenu', function (event) { return event.preventDefault(); });
function onCellClick(event) {
    var rect = gameCanvas.getBoundingClientRect();
    var x = event.clientX - rect.left; //x position within the element.
    var y = event.clientY - rect.top; //y position within the element.
    var cellSize = gameCanvas.width / gridSize;
    var xIndex = Math.floor(x / cellSize);
    var yIndex = Math.floor(y / cellSize);
    if (cells[xIndex][yIndex].state == CellState.Empty) {
        cells[xIndex][yIndex].state = CellState.Cross;
    }
    else {
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
    var ctx = gameCanvas.getContext('2d');
    var size = gameCanvas.offsetWidth;
    gameCanvas.style.width = "".concat(size, "px");
    gameCanvas.style.height = "".concat(size, "px");
    // Set actual size in memory (scaled to account for extra pixel density).
    var scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.
    gameCanvas.width = Math.floor(size * scale);
    gameCanvas.height = Math.floor(size * scale);
    // Normalize coordinate system to use CSS pixels.
    ctx.scale(scale, scale);
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    drawBackground(ctx);
    drawCells(ctx);
}
function drawCells(ctx) {
    var cellWidth = (gameCanvas.width - gridSize * gridSpacing - gridSpacing) / gridSize;
    var cellHeight = (gameCanvas.height - gridSize * gridSpacing - gridSpacing) / gridSize;
    for (var x = 0; x < gridSize; x++) {
        for (var y = 0; y < gridSize; y++) {
            var cell = cells[x][y];
            drawCell(ctx, cell, cellWidth, cellHeight);
        }
    }
}
function drawBackground(ctx) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
}
function drawCell(ctx, cell, cellWidth, cellHeight) {
    var posX = (cellWidth + gridSpacing) * cell.index.x + gridSpacing;
    var posY = (cellHeight + gridSpacing) * cell.index.y + gridSpacing;
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
function drawCross(ctx, x, y, cellWidth, cellHeight) {
    ctx.fillStyle = "black";
    ctx.fillRect(x + cellWidth / 2 - 5, y + cellHeight / 2 - 5, 10, 10);
}
function drawEmptyCell(ctx, x, y, cellWidth, cellHeight) {
    ctx.fillStyle = "white";
    ctx.fillRect(x, y, cellHeight, cellWidth);
}
//#endregion
