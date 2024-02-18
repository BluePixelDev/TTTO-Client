import { Transform2D } from "./transform2D";
import { Vector2 } from "./vector2";

export interface Renderable {
    transform: Transform2D;

    render(ctx: CanvasRenderingContext2D): void;
}

export class Renderer implements Renderable {
    transform: Transform2D = new Transform2D;

    render(ctx: CanvasRenderingContext2D): void {
        ctx.save();

        const position = this.transform.getWorldPosition();
        const scale = this.transform.getWorldScale();

        ctx.translate(position.x, position.y);
        ctx.scale(scale.x, scale.y);
        ctx.rotate(this.transform.rotation * Math.PI / 180);

        this.subRender(ctx);

        ctx.restore();
    }

    subRender(_ctx: CanvasRenderingContext2D) :void {}
}
export class SpriteRenderer extends Renderer {  
    image: HTMLImageElement | null = null;

    subRender(ctx: CanvasRenderingContext2D): void {
        const offset : Vector2 = this.transform.size.multiply(this.transform.anchor);
        if(this.image != null){             
            ctx.drawImage(this.image, -offset.x , -offset.y, this.transform.size.x, this.transform.size.y);
            ctx.fillStyle = 'black';
        }
    }
}
export class FillRectRenderer extends Renderer {  
    fillStyle: string = "white";
    subRender(ctx: CanvasRenderingContext2D): void {
        const offset : Vector2 = this.transform.size.multiply(this.transform.anchor);
        ctx.fillStyle = this.fillStyle;
        ctx.fillRect(-offset.x, -offset.y, this.transform.size.x, this.transform.size.y);
    }
}