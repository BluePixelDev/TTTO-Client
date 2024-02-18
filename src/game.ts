import { Cell, CellState } from './game/cell.ts';
import { Vector2 } from './game/rendering/vector2.ts';
import { Ease, Sequence, Tweener } from './util/tweener/tweening.ts';

import crossImageURL from '../public/cross.svg'
import circleImageURL from '../public/circle.svg'
import { FillRectRenderer, SpriteRenderer } from './game/rendering/renderer.ts';

export default class Game {
    gameCanvas: HTMLCanvasElement;

    //==== ASSETS ====
    crossImage: HTMLImageElement = new Image();
    circleImage: HTMLImageElement = new Image();

    boardSize = 3 as number;
    gridSpacing = 2 as number;
    countInRowToWin = 4 as number;

    cellData = [] as Cell[][];
    lastState = 0;

    constructor(boardSize: number, canvas: HTMLCanvasElement) {
        this.boardSize = boardSize;
        this.gameCanvas = canvas;
        this.crossImage.src = crossImageURL;
        this.circleImage.src = circleImageURL;

        //==== INIT ====
        this.gameCanvas.addEventListener("click", this.onCellClick.bind(this));
        this.gameCanvas.addEventListener('contextmenu', (event) => event.preventDefault());
        this.setupGame();
    }

    setupGame() {
        for (let x = 0; x < this.boardSize; x++) {
            this.cellData[x] = [];
            for (let y = 0; y < this.boardSize; y++) {
                const pos = new Vector2(x, y); //Index position of the cell
                const cell = new Cell(pos, CellState.Empty); //The cell itself
                const cellRenderer = new FillRectRenderer(); //Creating cell renderer
                const contentRenderer = new SpriteRenderer(); //Creating cell content renderer

                //Cell renderer setup
                cell.cellRenderer = cellRenderer;
                cellRenderer.transform.scale = Vector2.zero()

                //Cell content renderer
                cell.contentRenderer = contentRenderer;
                contentRenderer.transform.scale = Vector2.zero();
                contentRenderer.transform.parent = cell.cellRenderer.transform;

                //Assigning cell to the array
                this.cellData[x][y] = cell;

                //Animating in transistion
                setTimeout(() => {
                    Tweener.TweenTo(0, 1, 0.1).addEventListener('onUpdate', (value: any) => {
                        if (cell.cellRenderer) {
                            cell.cellRenderer.transform.scale = new Vector2(value, value);
                        }
                    }).setEase(Ease.OutBack);
                }, 100 * (x + y))

            }
        }
    }

    render() {
        const ctx = this.gameCanvas.getContext('2d');

        const size = 500;
        this.gameCanvas.style.width = `${size}px`;
        this.gameCanvas.style.height = `${size}px`;

        const scale = window.devicePixelRatio;
        this.gameCanvas.width = Math.floor(size * scale);
        this.gameCanvas.height = Math.floor(size * scale);

        if (ctx == null) return;

        // Normalize coordinate system to use CSS pixels.
        ctx.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
        this.drawCells(ctx);
    }

    drawCells(ctx: CanvasRenderingContext2D) {
        let cellWidth = (this.gameCanvas.width - (this.boardSize + 1) * this.gridSpacing) / this.boardSize;
        let cellHeight = (this.gameCanvas.height - (this.boardSize + 1) * this.gridSpacing) / this.boardSize;

        for (let x = 0; x < this.boardSize; x++) {
            for (let y = 0; y < this.boardSize; y++) {
                let posX = (cellWidth + this.gridSpacing) * (x + 0.5) + this.gridSpacing;
                let posY = (cellHeight + this.gridSpacing) * (y + 0.5) + this.gridSpacing;

                const cell = this.cellData[x][y];

                if (cell.cellRenderer) {
                    const transform = cell.cellRenderer.transform;
                    transform.position = new Vector2(posX, posY);
                    transform.size = new Vector2(cellWidth, cellHeight);
                    cell.cellRenderer.render(ctx);
                }
                if (cell.contentRenderer) {
                    const transform = cell.contentRenderer.transform;
                    transform.size = new Vector2(cellWidth - 10, cellHeight - 10);

                    switch (cell.state) {
                        case CellState.Cross:
                            cell.contentRenderer.render(ctx);
                            break;

                        case CellState.Circle:
                            cell.contentRenderer.render(ctx);
                            break;
                    }
                }
            }
        }
    }

    //==== EVENTS ====
    onCellClick(event: MouseEvent) {
        const rect = this.gameCanvas.getBoundingClientRect();
        const xScale = window.devicePixelRatio || 1;
        const yScale = window.devicePixelRatio || 1;

        const x = (event.clientX - rect.left) * xScale;
        const y = (event.clientY - rect.top) * yScale;
        this.clickOnCell(x, y);
        this.checkForWin();
    }
    clickOnCell(posX: number, posY: number) {
        const cellSize = this.gameCanvas.width / this.boardSize;
        const xIndex = Math.floor(posX / cellSize);
        const yIndex = Math.floor(posY / cellSize);
        const cell = this.cellData[xIndex][yIndex];

        const keys = Object.values(CellState).filter((x) => typeof x === 'number');

        this.lastState++;
        this.lastState = this.lastState % keys.length;

        if (this.lastState === 0) {
            this.lastState = 1;
        }

        this.changeCellState(cell, this.lastState);
    }
    changeCellState(cell: Cell, cellState: CellState) {
        if (cell.contentRenderer) {
            const transform = cell.contentRenderer.transform;
            const seq = new Sequence();

            cell.state = cellState;
            seq.append(Tweener.Tween(
                () => transform.scale.x,
                (x) => transform.scale = new Vector2(x, x), 0, 0.1
            ).addEventListener('onComplete',
                () => this.changeCellContent(cell)
            ).setEase(Ease.InBack));

            seq.append(Tweener.Tween(
                () => transform.scale.x,
                (x) => transform.scale = new Vector2(x, x), 1, 0.1
            ).setEase(Ease.OutBack));
        }
    }
    changeCellContent(cell: Cell) {
        if (cell.contentRenderer) {
            switch (cell.state) {
                case CellState.Cross:
                    (cell.contentRenderer as SpriteRenderer).image = this.crossImage;
                    break;

                case CellState.Circle:
                    (cell.contentRenderer as SpriteRenderer).image = this.circleImage;
                    break;
            }
        }
    }

    checkForWin(): Cell[] | null {
        let winnigCells: Cell[] = [];
        for (let x = 0; x < this.boardSize; x++) {
            for (let y = 0; y < this.boardSize; y++) {

                const cell = this.cellData[x][y];
                let check = this.checkCellNeighbours(cell, (winningCells) => {
                    winningCells.forEach(element => {
                        (element.cellRenderer as FillRectRenderer).fillStyle = "orange"
                    });
                });

                if (check) {
                    console.log("Someone scored! " + cell.state);
                    break;
                }
            }
        }
        return winnigCells;
    }
    checkCellNeighbours(cell: Cell, out: (winningCells: Cell[]) => void): Boolean {

        if (cell.state == CellState.Empty) {
            return false
        }

        let winningCells: Cell[] = [];
        for (let x = -1; x < 2; x++) {
            for (let y = -1; y < 2; y++) {
                if (x == 0 && y == 0) continue;

                const cells = this.checkCellsInDirection(x, y, cell);
                if (cells.length >= this.countInRowToWin) {
                    winningCells = winningCells.concat(cells);
                }
            }
        }

        out(winningCells);
        return winningCells.length > 0;
    }
    checkCellsInDirection(dirX: number, dirY: number, cell: Cell): Cell[] {
        let cellsInRow: Cell[] = [];
        for (let i = 0; i < this.boardSize; i++) {
            let nextPosX = cell.index.x + dirX * i;
            let nextPosY = cell.index.y + dirY * i;

            if (nextPosX >= this.boardSize) {
                break;
            }
            if (nextPosX < 0) {
                break;
            }

            if (nextPosY >= this.boardSize) {
                break;
            }
            if (nextPosY < 0) {
                break;
            }

            let nextCell = this.cellData[nextPosX][nextPosY];
            if (nextCell.state != CellState.Empty) {
                if (nextCell.state == cell.state) {
                    cellsInRow.push(nextCell);
                    continue;
                }
            }
            break;
        }
        return cellsInRow;
    }
}
