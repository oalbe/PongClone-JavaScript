// TODO: Consider defaulting both the speeds and the position
class Ball {
    constructor(color, radius, position, hSpeed, vSpeed) {
        this.color = color;
        this.radius = radius;
        this.hSpeed = hSpeed;
        this.vSpeed = vSpeed;
        this.pos = position;
    }

    restart() {
        this.pos.x = canvas.hCenter;
        this.pos.y = canvas.vCenter;

        this.hSpeed = randsign() * Ball.basehSpeed;
        this.vSpeed = randbound(-10, 10);
    }
}

Ball.basehSpeed = 8;