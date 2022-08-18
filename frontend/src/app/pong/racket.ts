export class Racket {
    racketElement: HTMLElement;
    t: number = 0;
    top = '10px';

    constructor(racketElement: HTMLElement) {
        this.racketElement = racketElement;
    }

    moveUp() {
        this.t -= 5;
        this.top = this.t + 'px';
        this.racketElement.style.top = this.top;
    }

    moveDown() {
        this.t += 5;
        this.top = this.t + 'px';
        this.racketElement.style.top = this.top;
    }
}
