class Button {
    constructor(width, height, position, borderWidth) {
        this.width = width;
        this.height = height;
        this.borderWidth = borderWidth;
        this.pos = position;

        this.clicked = false;
    }

    click() {
        this.clicked = !this.clicked;
    }

    isHovered(mousePos) {
        if ((mousePos.x >= this.pos.x) &&
            (mousePos.x <= (this.pos.x + this.width))) {
            if ((mousePos.y >= this.pos.y) &&
                (mousePos.y <= (this.pos.y + this.height))) {
                return true;
            }
        }

        return false;
    }
}

class TextButton extends Button {
    constructor(width, height, position, borderWidth) {
        super(width, height, position, borderWidth);
    }

    bubble() {
        this.borderWidth = 8;
    }
}