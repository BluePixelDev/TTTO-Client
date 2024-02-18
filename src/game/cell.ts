import { Renderer } from "./rendering/renderer";
import { Vector2 } from "./rendering/vector2";

export enum CellState {
    Empty = 0,
    Cross = 1,
    Circle = 2,
}

export class Cell {
    index: Vector2
    state: CellState

    cellRenderer: Renderer | null = null;
    contentRenderer: Renderer | null = null;

    constructor(position: Vector2, state: CellState) {
        this.index = position;
        this.state = state;
    }
}