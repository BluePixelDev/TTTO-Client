import Tween from "./tween";

export interface TweenGetter {
    (): number;
}
export interface TweenSetter {
    (value: number): void;
}

export default class Tweener {
    private static instance: Tweener;
    private tweens: Tween[] = [];
    private lastTime: number = Date.now();

    private constructor() {
        this.tweenUpdateLoop = this.tweenUpdateLoop.bind(this);
        this.tweenUpdateLoop();
    }

    private static getInstance(): Tweener {
        if (!this.instance) {
            this.instance = new Tweener();
        }
        return this.instance;
    }

    private addTween(from: number, to: number, duration: number): Tween {
        const t = new Tween(from, to, duration)
        this.tweens.push(t);
        return t;
    }
    private addTweenSet(getter: TweenGetter, setter: TweenSetter, target: number, duration: number): Tween {
        const t = new Tween(getter, target, duration).addEventListener('onUpdate', (value) => {
            setter(value);
        });
        this.tweens.push(t);
        return t;
    }
    private tweenUpdateLoop(): void {
        const elapsed = Date.now() - this.lastTime;
        const delta = elapsed / 1000;
        const interval = Math.max(1000 / 60 - elapsed, 0);

        this.tweens.forEach(element => {
            element.updateTween(delta);
        });

        this.lastTime = Date.now();
        setTimeout(this.tweenUpdateLoop, interval);
    }


    static Tween(getter: TweenGetter, setter: TweenSetter, target: number, duration: number): Tween {
        const tweener = this.getInstance();
        return tweener.addTweenSet(getter, setter, target, duration);
    }

    static TweenTo(from: number, to: number, duration: number): Tween {
        const tweener = this.getInstance();
        return tweener.addTween(from, to, duration);
    }

    static killTween(tween: Tween) {
        const tweener = this.getInstance();
        const index = tweener.tweens.indexOf(tween, 0);
        if (index > -1) {
            tweener.tweens.splice(index, 1);
        }
    }
}