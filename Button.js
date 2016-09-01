class Button {
    constructor(width, height, borderWidth, position) {
        this.width = width;
        this.height = height;
        this.borderWidth = borderWidth;
        this.pos = position;

        this.clicked = false;
    }

    click() {
        this.clicked = !this.clicked;
    }
}