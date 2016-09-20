let prev = Date.now();

class Coord {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}

let canvas = document.getElementById('game-canvas');
let canvasContext = canvas.getContext('2d');

canvas.hCenter = canvas.width / 2;
canvas.vCenter = canvas.height / 2;

let pong = new Game(canvas, canvasContext);

pong.canvas.addEventListener('mousemove', function(event) {
    if (pong.isPaused()) return;

    pong.racketLeft.moveToRelative(getMousePosition(event).y);
});

document.addEventListener('keydown', function(event) {
    // Toggle pause
    if (event.key === 'p') {
        // pong.isPaused = !pong.isPaused;
        pong.togglePause();
        pong.audioEffects.effects.game_paused.play();

        console.log('p-key down: Game paused.');
    }

    // Toggle mute
    if (event.key === 'm') {
        pong.soundButton.click();
        pong.audioEffects.toggleMuteAll();
    }

    // Space pressed
    if (event.key === ' ') {
        if (pong.isSplashScreen) {
            pong.isSplashScreen = false;
        }

        if (pong.isLoseScreen || pong.isWinScreen) {
            pong.isLoseScreen = pong.isWinScreen = false;
            pong.ball.restart();
            pong.playerRight.setScore(0);
            pong.playerLeft.setScore(0);
        }
    }
});

pong.canvas.addEventListener('click', function(event) {
    let mousePos = getMousePosition(event);

    // Check if the click happened inside the boundaries of the button.
    if ((mousePos.x >= pong.soundButton.pos.x) &&
        (mousePos.x <= (pong.soundButton.pos.x + pong.soundButton.width))) {
        if ((mousePos.y >= pong.soundButton.pos.y) &&
            (mousePos.y <= (pong.soundButton.pos.y + pong.soundButton.height))) {
            pong.soundButton.click();
            pong.audioEffects.toggleMuteAll();
        }
    }
});

(function() {
    pong.loop(prev);
}());