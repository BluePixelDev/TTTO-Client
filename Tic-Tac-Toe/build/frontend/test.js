var grid = document.getElementById("game-grid");
var template = document.getElementById("tic-tac-toe-square");
var size = 50;
grid.style.cssText = "grid-template-rows: repeat(".concat(size, ", 1fr); grid-template-columns: repeat(").concat(size, ", 1fr);");
grid.innerHTML = " ";
for (var w = 0; w < size; w++) {
    for (var h = 0; h < size; h++) {
        grid.append(createCell());
    }
}
function createCell() {
    var cellDiv = document.createElement("div");
    cellDiv.classList.add("tic-tac-toe-element");
    var cellButton = document.createElement("button");
    cellDiv.append(cellButton);
    return cellDiv;
}
