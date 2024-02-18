import Tween from "./tween";

class Sequence {
    prevTween: Tween | null = null;
    append(tween: Tween) {       
        if (this.prevTween) {
            tween.pause();
            this.prevTween.addEventListener('onComplete', () => {
                tween.play();
            });
        }
        this.prevTween = tween;
    }
}

export default Sequence;