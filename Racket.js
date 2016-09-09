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

        // ***
        // Racket collisions
        // ***
        // Top boundary
        if (this.pos.y <= 0) {
            this.pos.y = Racket.offset;
        }

        // Bottom boundary
        if (this.pos.y >= (canvas.height - this.height)) {
            this.pos.y = canvas.height - this.height - Racket.offset;
        }
    }

    moveToOrig() {
        this.moveToRelative(canvas.vCenter);
    }
}

Racket.offset = 5;