function randbound(min, max) {
    return Math.random() * (max - min) + min;
}

function randsign() {
    return (randbound(0, 100) > 50) ? -1 : 1;
}

function getMousePosition(event) {
    var rect = canvas.getBoundingClientRect();
    var rootElement = document.documentElement;
    var xMousePos = event.clientX - rect.left - rootElement.scrollLeft;
    var yMousePos = event.clientY - rect.top - rootElement.scrollTop;

    return {
        x: xMousePos,
        y: yMousePos
    };
}