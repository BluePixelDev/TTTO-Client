export enum Ease {
    Linear,

    InSine,
    OutSine,
    InOutSine,

    InQuad,
    OutQuad,
    InOutQuad,

    InCubic,
    OutCubic,
    InOutCubic,

    InQuart,
    OutQuart,
    InOutQuart,

    InQuint,
    OutQuint,
    InOutQuint,

    InExpo,
    OutExpo,
    InOutExpo,

    InCirc,
    OutCirc,
    InOutCirc,

    InBack,
    OutBack,
    InOutBack,

    InElastic,
    OutElastic,
    InOutElastic,

    InBounce,
    OutBounce,
    InOutBounce,
}

export default class EasingUtility {
    static calculate(time: number, easing: Ease): number {
        switch (easing) {
            //Linear
            case Ease.Linear: return this.easeLinear(time);
            //Sine
            case Ease.InSine: return this.easeInSine(time);
            case Ease.OutSine: return this.easeOutSine(time);
            case Ease.InOutSine: return this.easeInOutSine(time);
            //Quad
            case Ease.InQuad: return this.easeInQuad(time);
            case Ease.OutQuad: return this.easeOutQuad(time);
            case Ease.InOutQuad: return this.easeInOutQuad(time);
            //Cubic
            case Ease.InCubic: return this.easeInCubic(time);
            case Ease.OutCubic: return this.easeOutCubic(time);
            case Ease.InOutCubic: return this.easeInOutCubic(time);
            //Quart
            case Ease.InQuart: return this.easeInQuart(time);
            case Ease.OutQuart: return this.easeOutQuart(time);
            case Ease.InOutQuart: return this.easeInOutQuart(time);
            //Quint
            case Ease.InQuint: return this.easeInQuint(time);
            case Ease.OutQuint: return this.easeOutQuint(time);
            case Ease.InOutQuint: return this.easeInOutQuint(time);
            //Expo
            case Ease.InExpo: return this.easeInExpo(time);
            case Ease.OutExpo: return this.easeOutExpo(time);
            case Ease.InOutExpo: return this.easeInOutExpo(time);
            //Circ
            case Ease.InCirc: return this.easeInCirc(time);
            case Ease.OutCirc: return this.easeOutCirc(time);
            case Ease.InOutCirc: return this.easeInOutCirc(time);
            //Back
            case Ease.InBack: return this.easeInBack(time);
            case Ease.OutBack: return this.easeOutBack(time);
            case Ease.InOutBack: return this.easeInOutBack(time);
            //Elastic
            case Ease.InElastic: return this.easeInElastic(time);
            case Ease.OutElastic: return this.easeOutElastic(time);
            case Ease.InOutElastic: return this.easeInOutElastic(time);
            //Bounce
            case Ease.InBounce: return this.easeInBounce(time);
            case Ease.OutBounce: return this.easeOutBounce(time);
            case Ease.InOutBounce: return this.easeInOutBounce(time);

            default: return 0;
        }
    }
    static lerp(x: number, y: number, t: number): number {
        return x + (y - x) * t;
    }

    //==== LINEAR ====
    private static easeLinear(x: number): number {
        return x;
    }
    //==== SINE ====
    private static easeInSine(x: number): number {
        return 1 - Math.cos((x * Math.PI) / 2);
    }
    private static easeOutSine(x: number): number {
        return Math.sin((x * Math.PI) / 2);
    }
    private static easeInOutSine(x: number): number {
        return -(Math.cos(Math.PI * x) - 1) / 2;
    }
    //==== QUAD ====
    private static easeInQuad(x: number): number {
        return x * x;
    }
    private static easeOutQuad(x: number): number {
        return 1 - (1 - x) * (1 - x);
    }
    private static easeInOutQuad(x: number): number {
        return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
    }
    //==== CUBIC ====
    private static easeInCubic(x: number): number {
        return x * x * x;
    }
    private static easeOutCubic(x: number): number {
        return 1 - Math.pow(1 - x, 3);
    }
    private static easeInOutCubic(x: number): number {
        return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    }
    //==== QUART ====
    private static easeInQuart(x: number): number {
        return x * x * x * x;
    }
    private static easeOutQuart(x: number): number {
        return 1 - Math.pow(1 - x, 4);
    }
    private static easeInOutQuart(x: number): number {
        return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
    }
    //==== QUINT ====
    private static easeInQuint(x: number): number {
        return x * x * x * x * x;
    }
    private static easeOutQuint(x: number): number {
        return 1 - Math.pow(1 - x, 5);
    }
    private static easeInOutQuint(x: number): number {
        return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
    }
    //==== EXPO ====
    private static easeInExpo(x: number): number {
        return x === 0 ? 0 : Math.pow(2, 10 * x - 10);

    }
    private static easeOutExpo(x: number): number {
        return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    }
    private static easeInOutExpo(x: number): number {
        return x === 0
            ? 0
            : x === 1
                ? 1
                : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2
                    : (2 - Math.pow(2, -20 * x + 10)) / 2;
    }
    //==== CIRC ====
    private static easeInCirc(x: number): number {
        return 1 - Math.sqrt(1 - Math.pow(x, 2));
    }
    private static easeOutCirc(x: number): number {
        return Math.sqrt(1 - Math.pow(x - 1, 2));
    }
    private static easeInOutCirc(x: number): number {
        return x < 0.5
            ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
            : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
    }
    //==== BACK ====
    private static easeInBack(x: number): number {
        const c1 = 1.70158;
        const c3 = c1 + 1;

        return c3 * x * x * x - c1 * x * x;
    }
    private static easeOutBack(x: number): number {
        const c1 = 1.70158;
        const c3 = c1 + 1;

        return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    }
    private static easeInOutBack(x: number): number {
        const c1 = 1.70158;
        const c2 = c1 * 1.525;

        return x < 0.5
            ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
            : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
    }
    //==== ELASTIC ====
    private static easeInElastic(x: number): number {
        const c4 = (2 * Math.PI) / 3;

        return x === 0
            ? 0
            : x === 1
                ? 1
                : -Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * c4);
    }
    private static easeOutElastic(x: number): number {
        const c4 = (2 * Math.PI) / 3;

        return x === 0
            ? 0
            : x === 1
                ? 1
                : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
    }
    private static easeInOutElastic(x: number): number {
        const c5 = (2 * Math.PI) / 4.5;

        return x === 0
            ? 0
            : x === 1
                ? 1
                : x < 0.5
                    ? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2
                    : (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 + 1;
    }
    //==== BOUNCE ====
    private static easeInBounce(x: number): number {
        return 1 - this.easeOutBounce(1 - x);

    }
    private static easeOutBounce(x: number): number {
        const n1 = 7.5625;
        const d1 = 2.75;

        if (x < 1 / d1) {
            return n1 * x * x;
        } else if (x < 2 / d1) {
            return n1 * (x -= 1.5 / d1) * x + 0.75;
        } else if (x < 2.5 / d1) {
            return n1 * (x -= 2.25 / d1) * x + 0.9375;
        } else {
            return n1 * (x -= 2.625 / d1) * x + 0.984375;
        }
    }
    private static easeInOutBounce(x: number): number {
        return x < 0.5
            ? (1 - this.easeOutBounce(1 - 2 * x)) / 2
            : (1 + this.easeOutBounce(2 * x - 1)) / 2;
    }

}
