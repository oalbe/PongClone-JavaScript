CanvasRenderingContext2D.prototype.drawFillRect = function(
  color, width, height, xOffset, yOffset) {
    this.lineCap = 'butt';
    this.lineJoin = 'miter';

    this.fillStyle = color;
    this.fillRect(xOffset, yOffset, width, height);

    return this;
};

CanvasRenderingContext2D.prototype.drawStrokeRect = function(
  color, width, height, xOffset, yOffset, lineWidth = 2) {
    this.lineCap = 'butt';
    this.lineJoin = 'miter';
    this.strokeStyle = color;
    this.lineWidth = lineWidth;

    this.setLineDash([0, 0]); // Resets any pre-set line dash styles
    this.strokeRect(xOffset, yOffset, width, height);

    return this;
};

CanvasRenderingContext2D.prototype.drawCirc = function(color, radius, xCenter, yCenter) {
    this.fillStyle = color;
    this.beginPath();
    this.arc(xCenter, yCenter, radius, 0, 2 * Math.PI);
    this.fill();

    return this;
};

CanvasRenderingContext2D.prototype.drawFillText = function(
  color, text, fontSize, fontFamily, xOffset, yOffset) {
    this.textBaseline = 'top';
    this.font = fontSize + "px " + fontFamily;

    this.fillStyle = color;
    this.fillText(text, xOffset, yOffset);

    return this;
};

CanvasRenderingContext2D.prototype.drawStrokeText = function(
  color, text, fontSize, fontFamily, xOffset, yOffset) {
    this.textBaseline = 'top';
    this.font = fontSize + "px " + fontFamily;

    this.strokeStyle = color;
    this.strokeText(text, xOffset, yOffset);


    return this;
};

CanvasRenderingContext2D.prototype.drawLine = function(
  color, width, lineDash, beginPointCoord, endPointCoord, dashOffset) {
    this.strokeStyle = color;
    this.lineWidth = width;
    this.lineCap = 'butt';
    this.lineJoin = 'miter';
    this.miterLimit = 1;

    this.lineDashOffset = dashOffset;
    this.setLineDash(lineDash);

    this.beginPath();
    this.moveTo(beginPointCoord.x, beginPointCoord.y);
    this.lineTo(endPointCoord.x, endPointCoord.y);
    this.stroke();

    return this;
};