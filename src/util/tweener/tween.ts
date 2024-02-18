import { TweenGetter } from "./tweener";
import { Tweener, Ease, EasingUtility } from "./tweening";

interface TweenCallback {
    (data: any): void;
}

interface EventMap {
    [eventName: string]: TweenCallback[];
}

export default class Tween {
    private isPlaying: boolean = false;
    private events: EventMap = {};
    private time: number = 0;

    private current: number = 0;
    private fromValue: number | TweenGetter = 0;
    private from: number = 0;
    private to: number
    private duration: number

    private ease: Ease = Ease.Linear;

    private initialized: boolean  = false;

    constructor(from: number | TweenGetter, to: number, duration: number) {
        this.fromValue = from;
        this.to = to;
        this.duration = duration;
        this.isPlaying = true;
    }

    addEventListener(eventName: string, callback: TweenCallback): Tween {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
        return this;
    }

    removeEventListener(eventName: string, callback: TweenCallback): Tween {
        const eventCallbacks = this.events[eventName];
        if (eventCallbacks) {
            this.events[eventName] = eventCallbacks.filter(cb => cb !== callback);
        }
        return this;
    }

    play() {
        this.isPlaying = true;
    }
    pause() {
        this.isPlaying = false;
    }

    updateTween(delta: number) {
        if (!this.isPlaying) return;

        if(!this.initialized) {
            this.from = typeof this.fromValue === 'function' ? (this.fromValue as TweenGetter)() : this.fromValue;
            this.current = this.from;
            this.initialized = true;
        }

        if (this.time >= 1) {
            this.trigger('onComplete', undefined);
            Tweener.killTween(this);
            return;
        }

        if (Math.abs(this.current - this.to) < 0.01) {
            this.trigger('onComplete', undefined);
            Tweener.killTween(this);
            return;
        }

        //Ensures that duration cannot be zero.
        if (this.duration <= 0) {
            this.time = 1;
        }
        else {
            //Advances time forward
            this.time = Math.min(this.time + delta / this.duration, 1);
        }

        //Limits the time to max one.
        this.time = this.time > 1 ? 1 : this.time;
        this.advanceTween();
    }

    setEase(ease: Ease): Tween {
        this.ease = ease;
        return this;
    }

    kill(complete: boolean) {
        if (complete) {
            this.time = 1;
            this.advanceTween();
        }
        Tweener.killTween(this);
    }

    private advanceTween() {
        //Calculates the t variable.
        const t = EasingUtility.calculate(this.time, this.ease);
        this.current = EasingUtility.lerp(this.from, this.to, t);
        this.trigger('onUpdate', this.current);
    }
    private trigger(eventName: string, data: any): void {
        const eventCallbacks = this.events[eventName];
        if (eventCallbacks) {
            eventCallbacks.forEach(callback => callback(data));
        }
    }
}