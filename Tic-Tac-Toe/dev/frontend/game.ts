const gameCanvas = document.getElementById("game-canvas") as HTMLCanvasElement;
const gridSize = 10 as number;

//==== CLASSES ====
class Point {
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
class Cell{
    point : Point
    state : CellState
}

let points = [] as Point[];

//==== SETUP ====
//-- Events
gameCanvas.addEventListener("click", (event) => {
    var rect = gameCanvas.getBoundingClientRect();
    var x = event.clientX - rect.left; //x position within the element.
    var y = event.clientY - rect.top;  //y position within the element.
    points.push(new Point(x, y))
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
    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

    points.forEach((element) => {
        ctx.fillStyle = "black";
        const width = gameCanvas.width / gridSize;
        const height = gameCanvas.height / gridSize;
        ctx.fillRect(element.x - width / 2, element.y - height / 2, width, height);
    });

    drawCheckerGrid(ctx);
}


function drawCheckerGrid(ctx: CanvasRenderingContext2D) {
    const xOffset = gameCanvas.width / gridSize;
    const yOffset = gameCanvas.height / gridSize;
    for (let x = 0; x < gridSize; x++) {
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(xOffset * x, 0)
        ctx.lineTo(xOffset * x, gameCanvas.height)
        ctx.stroke();
    }
    for (let y = 0; y < gridSize; y++) {
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, yOffset * y)
        ctx.lineTo(gameCanvas.width, yOffset * y)
        ctx.stroke();
    }
}