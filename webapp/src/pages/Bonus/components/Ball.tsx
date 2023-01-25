const INITIAL_VELOCITY = .002;
const VELOCITY_INCREASE = 0.0000001;
let tmp = false;

export default class Ball {
    ballElem: HTMLElement;
    direction: any;
    velocity!: number;
    velocity_toleft!: number;
    velocity_toright!: number;
    constructor(ballElem: any) {
        this.ballElem = ballElem;
        this.reset();
    }

    get x(){
        return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--x"));
    }

    set x(value){
        this.ballElem.style.setProperty("--x", value.toString());
    }

    get y(){
        return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--y"));
    }

    set y(value){
        this.ballElem.style.setProperty("--y", value.toString());
    }

    rect() {
        return this.ballElem.getBoundingClientRect();
    }

    get_x() {
        return this.x;
    }

    get_y() {
        return this.y;
    }

    set_x(value: number) {
        this.x = value;
    }

    set_y(value: number) {
        this.y = value;
    }

    reset(){
        this.x = 50;
        this.y = 50;
        this.direction = {
            x: 0,
        };
        while (Math.abs(this.direction.x) <= .2 || Math.abs(this.direction.x) >= 0.9){
            const heading = randomNumberBetween(0, 2 * Math.PI);
            this.direction = {
                x: Math.cos(heading),
                y: Math.sin(heading)
            };
        }
        this.velocity = INITIAL_VELOCITY;
        this.velocity_toleft = INITIAL_VELOCITY;
        this.velocity_toright = INITIAL_VELOCITY;
    }

    invert(){
        this.direction.x *= -1;
        if (this.direction.x > 0)
        {
            this.x += this.direction.x * this.velocity_toright * 10;
            this.y += this.direction.y * this.velocity_toright * 10;
        }
        else
        {
            this.x += this.direction.x * this.velocity_toleft * 10;
            this.y += this.direction.y * this.velocity_toleft * 10;
        }
    }

    stop(){
        this.x = 50;
        this.y = 50;
        this.direction = {
            x: 0,
        };
        while (Math.abs(this.direction.x) <= .2 || Math.abs(this.direction.x) >= 0.9){
            const heading = randomNumberBetween(0, 2 * Math.PI);
            this.direction = {
                x: Math.cos(heading),
                y: Math.sin(heading)
            };
        }
        this.velocity = 0;
    }

    update(delta: number, paddleRects: any, collision: number, power: number){
        const rect = this.rect();
        if (collision === 1) {
            this.direction.x *= -1;
            if (this.direction.x > 0)
            {
                this.x += this.direction.x * this.velocity_toright * delta;
                this.y += this.direction.y * this.velocity_toright * delta;
            }
            else
            {
                this.x += this.direction.x * this.velocity_toleft * delta;
                this.y += this.direction.y * this.velocity_toleft * delta;
            }
            tmp = false;
        }
        else if ((rect.bottom >= window.innerHeight || rect.top <= 60) && tmp === false) {
            this.direction.y *= -1;
            if (this.direction.x > 0)
            {
                this.x += this.direction.x * this.velocity_toright * delta * 10;
                this.y += this.direction.y * this.velocity_toright * delta * 10;
            }
            else
            {
                this.x += this.direction.x * this.velocity_toleft * delta * 10;
                this.y += this.direction.y * this.velocity_toleft * delta * 10;
            }
            tmp = true;
        }
        else
        {
            if (this.direction.x > 0)
            {
                this.x += this.direction.x * this.velocity_toright * delta * 10;
                this.y += this.direction.y * this.velocity_toright * delta * 10;
            }
            else
            {
                this.x += this.direction.x * this.velocity_toleft * delta * 10;
                this.y += this.direction.y * this.velocity_toleft * delta * 10;
            }
            tmp = false;
        }
        if (power === 0)
        {
            this.velocity_toleft += (VELOCITY_INCREASE * delta);
            this.velocity_toright += (VELOCITY_INCREASE * delta);
        }
        else if (power === 2)
        {
            this.velocity_toleft += (VELOCITY_INCREASE * delta) * 2;
            this.velocity_toright += (VELOCITY_INCREASE * delta) * 2;
        }
        else if (power === 3)
            this.velocity_toleft += VELOCITY_INCREASE * delta;
        else if (power == 4)
            this.velocity_toright += VELOCITY_INCREASE * delta;
        else if (power === 5)
        {
            this.velocity_toleft += VELOCITY_INCREASE * delta;
            this.velocity_toright += (VELOCITY_INCREASE * delta) * 2;
        }
        else if (power === 6)
        {
            this.velocity_toright += (VELOCITY_INCREASE * delta);
        }
        else if (power === 7)
        {
            this.velocity_toleft += VELOCITY_INCREASE * delta * 2;
            this.velocity_toright += (VELOCITY_INCREASE * delta);
        }
        else if (power === 8)
        {
            this.velocity_toleft += VELOCITY_INCREASE * delta;
        }
    }
}

function randomNumberBetween(min: number, max: number) {
    return Math.random() * (max-min) + min;
}
