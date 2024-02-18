import { Vector2 } from "./vector2";

export class Transform2D {
    parent: Transform2D | null = null;
    position: Vector2 = Vector2.zero();
    scale: Vector2 = Vector2.one();
    rotation: number = 0;
    size: Vector2 = Vector2.one();
    anchor: Vector2 = Vector2.half();

    getWorldPosition(): Vector2 {
        let parentPosition = Vector2.zero();
        if (this.parent) {
            parentPosition = this.parent.getWorldPosition();
        }

        const localPosition = new Vector2(this.position.x, this.position.y);
        return localPosition.add(parentPosition);
    }

    getWorldScale(): Vector2 {
        let parentScale = Vector2.one();
        if (this.parent) {
            parentScale = this.parent.getWorldScale();
        }
        return this.scale.multiply(parentScale);
    }

    getWorldRotation(): number {
        let parentRotation = 0;
        if (this.parent) {
            parentRotation = this.parent.getWorldRotation();
        }
        return this.rotation + parentRotation;
    }
}