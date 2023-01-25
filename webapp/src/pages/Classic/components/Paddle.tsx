const SPEED = 0.02;

export default class Paddle {
    paddleElem: HTMLElement;
    constructor(paddleElem: any) {
        this.paddleElem = paddleElem;
        this.reset();
    }

    get position(){
        return parseFloat(getComputedStyle(this.paddleElem).getPropertyValue('--position'));
    }

    set position(value) {
        this.paddleElem.style.setProperty('--position', value.toString());
    }

    rect(){
        return (this.paddleElem.getBoundingClientRect());
    }

    update(delta: number, ballHeight: number) {
        this.position += SPEED * delta * (ballHeight - this.position);
    }

    reset() {
        this.position = 50;
    }
}
