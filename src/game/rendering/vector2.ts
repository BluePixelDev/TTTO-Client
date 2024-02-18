export class Vector2 {
    x: number
    y: number

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    multiply(vec2: Vector2): Vector2{
        return new Vector2(this.x * vec2.x, this.y * vec2.y);
    }
    divide(vec2: Vector2): Vector2{
        return new Vector2(this.x / vec2.x, this.y / vec2.y);
    }
    add(vec2: Vector2) {
        return new Vector2(this.x + vec2.x, this.y + vec2.y);
    }
    sub(vec2: Vector2) {
        return new Vector2(this.x - vec2.x, this.y - vec2.y);
    }

    static half(): Vector2 {
        return new Vector2(0.5, 0.5);
    }
    static one(): Vector2 {
        return new Vector2(1, 1);
    }
    static zero(): Vector2 {
        return new Vector2(0, 0);
    }
}