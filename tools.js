function randbound(min, max) {
    return Math.random() * (max - min) + min;
}

function randsign() {
    return (randbound(0, 100) > 50) ? -1 : 1;
}

function getMousePosition(event) {
    let rect = canvas.getBoundingClientRect();
    let rootElement = document.documentElement;
    let xMousePos = event.clientX - rect.left - rootElement.scrollLeft;
    let yMousePos = event.clientY - rect.top - rootElement.scrollTop;

    return {
        x: xMousePos,
        y: yMousePos
    };
}