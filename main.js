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

    if (pong.isDifficultyMenu) {
        if (pong.easyDiffButton.isHovered(getMousePosition(event))) {
            console.log('easy!');
            pong.easyDiffButton.bubble();
        }

        if (pong.mediumDiffButton.isHovered(getMousePosition(event))) {
            console.log('medium!');
        }

        if (pong.hardDiffButton.isHovered(getMousePosition(event))) {
            console.log('hard!');
        }
    }
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
            pong.isDifficultyMenu = true;
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

    if (pong.soundButton.isHovered(mousePos)) {
        pong.soundButton.click();
        pong.audioEffects.toggleMuteAll();
    }
});

(function() {
    pong.loop(prev);
}());