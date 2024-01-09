var gameCanvas = document.getElementById("game-canvas");
var gridSize = 10;
//==== CLASSES ====
var Point = /** @class */ (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    return Point;
}());
var CellState;
(function (CellState) {
    CellState[CellState["Empty"] = 0] = "Empty";
    CellState[CellState["Cross"] = 1] = "Cross";
    CellState[CellState["Circle"] = 2] = "Circle";
})(CellState || (CellState = {}));
var Cell = /** @class */ (function () {
    function Cell() {
    }
    return Cell;
}());
var points = [];
//==== SETUP ====
//-- Events
gameCanvas.addEventListener("click", function (event) {
    var rect = gameCanvas.getBoundingClientRect();
    var x = event.clientX - rect.left; //x position within the element.
    var y = event.clientY - rect.top; //y position within the element.
    points.push(new Point(x, y));
});
//
//==== MAIN LOOP ====
requestAnimationFrame(gameLoop);
function gameLoop() {
    updateLoop();
    drawLoop();
    requestAnimationFrame(gameLoop);
}
function updateLoop() {
}
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
    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    points.forEach(function (element) {
        ctx.fillStyle = "black";
        var width = gameCanvas.width / gridSize;
        var height = gameCanvas.height / gridSize;
        ctx.fillRect(element.x - width / 2, element.y - height / 2, width, height);
    });
    drawCheckerGrid(ctx);
}
function drawCheckerGrid(ctx) {
    var xOffset = gameCanvas.width / gridSize;
    var yOffset = gameCanvas.height / gridSize;
    for (var x = 0; x < gridSize; x++) {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(xOffset * x, 0);
        ctx.lineTo(xOffset * x, gameCanvas.height);
        ctx.stroke();
    }
    for (var y = 0; y < gridSize; y++) {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, yOffset * y);
        ctx.lineTo(gameCanvas.width, yOffset * y);
        ctx.stroke();
    }
}
