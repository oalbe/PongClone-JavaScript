class Text {
    constructor(color, text, fontSize, fontFamily, position, fill = true) {
        this.color = color;
        this.text = text;
        this.fontSize = fontSize;
        this.fontFamily = fontFamily;
        this.width = this.width_helper();
        this.height = fontSize;
        this.pos = position;
        this.fill = fill;
    }

    width_helper() {
        canvasContext.textBaseline = 'top';
        canvasContext.font = this.fontSize + 'px ' + this.fontFamily;

        return canvasContext.measureText(this.text).width;
    }
}