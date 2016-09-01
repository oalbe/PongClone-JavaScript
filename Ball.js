// TODO: Consider defaulting both the speeds and the position
class Ball {
    constructor(color, radius, hSpeed, vSpeed, position) {
        this.color = color;
        this.radius = radius;
        this.hSpeed = hSpeed;
        this.vSpeed = vSpeed;
        this.pos = position;
    }

    restart() {
        this.pos.x = canvas.hCenter;
        this.pos.y = canvas.vCenter;

        this.hSpeed = randsign() * bhSpeed;
        this.vSpeed = randbound(-10, 10);
    }
}