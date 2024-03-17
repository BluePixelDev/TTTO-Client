import { Cell, CellState } from './game/cell.ts';
import { Vector2 } from './game/rendering/vector2.ts';
import { Ease, Sequence, Tweener } from './util/tweener/tweening.ts';

import crossImageURL from '../public/cross.svg'
import circleImageURL from '../public/circle.svg'
import { FillRectRenderer, SpriteRenderer } from './game/rendering/renderer.ts';
import ServerSocket from './util/serverSocket.ts';

export default class Game {
    gameCanvas: HTMLCanvasElement;
    serverSocket: ServerSocket

    //==== ASSETS ====
    crossImage: HTMLImageElement = new Image();
    circleImage: HTMLImageElement = new Image();

    boardSize = 3 as number;
    gridSpacing = 2 as number;
    inRowToWin = 4 as number;

    cells = [] as Cell[][];
    lastState = 0;

    constructor(canvas: HTMLCanvasElement, serverSocket: ServerSocket, boardSize: number, inRowToWin: number) {
        this.gameCanvas = canvas;
        this.serverSocket = serverSocket;
        this.boardSize = boardSize;
        this.inRowToWin = inRowToWin;
        this.crossImage.src = crossImageURL;
        this.circleImage.src = circleImageURL;

        //==== INIT ====
        this.gameCanvas.addEventListener("click", this.onCellClick.bind(this));
        this.gameCanvas.addEventListener('contextmenu', (event) => event.preventDefault());
        this.setupGame();
        this.setupSocket();
    }

    setupGame() {
        for (let x = 0; x < this.boardSize; x++) {
            this.cells[x] = [];
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
                this.cells[x][y] = cell;

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

    //==== EVENTS ====
    onCellClick(event: MouseEvent) {
        const rect = this.gameCanvas.getBoundingClientRect();
        const xScale = window.devicePixelRatio || 1;
        const yScale = window.devicePixelRatio || 1;

        const x = (event.clientX - rect.left) * xScale;
        const y = (event.clientY - rect.top) * yScale;
        this.clickOnCell(x, y);
    }
    clickOnCell(posX: number, posY: number) {
        const cellSize = this.gameCanvas.width / this.boardSize;
        const xIndex = Math.floor(posX / cellSize);
        const yIndex = Math.floor(posY / cellSize);

        const keys = Object.values(CellState).filter((x) => typeof x === 'number');

        this.lastState++;
        this.lastState = this.lastState % keys.length;

        if (this.lastState === 0) {
            this.lastState = 1;
        }
        this.serverSocket.socket.emit('set-cell', { cellX: xIndex, cellY: yIndex })
    }
    changeCellState(cell: Cell, cellState: CellState) {
        if(cell.state == cellState) return;
        
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

    setupSocket() {
        this.serverSocket.socket.on('set-cell', (res) => {
            console.log(res);
        });
        this.serverSocket.socket.on('on-board-update', (res) => {
            let x = 0;
            let y = 0;

            res.forEach((cells: any) => {
                cells.forEach((cell: any) => {
                    const targetCell = this.cells[x][y];
                    const state = this.jsonToEnum(cell.state);

                    if (state) {
                        this.changeCellState(targetCell, state);
                    }

                    y++;
                })
                y = 0;
                x++;
            })
        })
    }
    private jsonToEnum(jsonData: any): CellState | null {
        // Define a mapping between JSON strings and enum values
        const enumMapping: { [key: string]: CellState } = {
            "Empty": CellState.Empty,
            "Cross": CellState.Cross,
            "Circle": CellState.Circle
        };
        // Check if the JSON data is a valid key in the mapping
        if (jsonData in enumMapping) {
            return enumMapping[jsonData]; // Return the corresponding enum value
        } else {
            return null; // Return null if no matching enum value is found
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

    private drawCells(ctx: CanvasRenderingContext2D) {
        let cellWidth = (this.gameCanvas.width - (this.boardSize + 1) * this.gridSpacing) / this.boardSize;
        let cellHeight = (this.gameCanvas.height - (this.boardSize + 1) * this.gridSpacing) / this.boardSize;

        for (let x = 0; x < this.boardSize; x++) {
            for (let y = 0; y < this.boardSize; y++) {
                let posX = (cellWidth + this.gridSpacing) * (x + 0.5) + this.gridSpacing;
                let posY = (cellHeight + this.gridSpacing) * (y + 0.5) + this.gridSpacing;

                const cell = this.cells[x][y];

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
}
