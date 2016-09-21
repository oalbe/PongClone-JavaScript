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

// Pause the game when the tab isn't visible
window.addEventListener('blur', function() {
    pong.pause();
});

pong.canvas.addEventListener('mousemove', function(event) {
    if (pong.isPaused()) return;

    pong.racketLeft.moveToRelative(getMousePosition(event).y);

    if (pong.isDifficultyMenu) {
        // TODO: Do hovering animations here
        if (pong.easyDiffButton.isHovered(getMousePosition(event))) {
            // pong.easyDiffButton.bubble();
        }

        if (pong.mediumDiffButton.isHovered(getMousePosition(event))) {
        }

        if (pong.hardDiffButton.isHovered(getMousePosition(event))) {
        }
    }
});

document.addEventListener('keydown', function(event) {
    // Toggle pause
    if (event.key === 'p') {
        pong.togglePause();
        pong.audioEffects.effects.game_paused.play();

        return;
    }

    // Toggle mute
    if (event.key === 'm') {
        pong.soundButton.click();
        pong.audioEffects.toggleMuteAll();

        return;
    }

    // Space pressed
    if (event.key === ' ') {
        if (pong.isSplashScreen) {
            pong.isSplashScreen = false;
            pong.isDifficultyMenu = true;

            return;
        }

        if (pong.isLoseScreen || pong.isWinScreen) {
            pong.isLoseScreen = pong.isWinScreen = false;
            pong.isDifficultyMenu = true;
            pong.ball.restart();
            pong.playerRight.setScore(0);
            pong.playerLeft.setScore(0);

            return;
        }
    }
});

pong.canvas.addEventListener('click', function(event) {
    let mousePos = getMousePosition(event);

    if (pong.soundButton.isHovered(mousePos)) {
        pong.soundButton.click();
        pong.audioEffects.toggleMuteAll();

        return;
    }

    if (pong.isDifficultyMenu) {
        if (pong.easyDiffButton.isHovered(mousePos)) {
            pong.isDifficultyMenu = false;
            pong.easyDiffButton.click();
            pong.setDifficulty('EASY');
        } else if (pong.mediumDiffButton.isHovered(mousePos)) {
            pong.isDifficultyMenu = false;
            pong.mediumDiffButton.click();
            pong.setDifficulty('MEDIUM');
        } else if (pong.hardDiffButton.isHovered(mousePos)) {
            pong.isDifficultyMenu = false;
            pong.hardDiffButton.click();
            pong.setDifficulty('HARD');
        }

        // Actually set the chosen difficulty
        pong.racketRight.speed = pong._difficultyLevels[pong._difficulty];

        return;
    }
});

(function() {
    pong.loop(prev);
}());