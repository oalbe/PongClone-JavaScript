class Racket {
    constructor(color, width, height, position, speed = 5) {
        this.color = color;
        this.width = width;
        this.height = height;
        this.pos = position;
        this.speed = speed;
    }

    center() {
        return {
            x: this.pos.x + (this.width / 2),
            y: this.pos.y + (this.height / 2)
        };
    }

    moveToRelative(relativePosition) {
        this.pos.y = relativePosition - (this.height / 2);
    }

    moveToOrig() {
        this.moveToRelative(canvas.vCenter);
    }
}