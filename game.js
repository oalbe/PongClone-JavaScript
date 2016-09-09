// TODO: Consider the possibility of adding bonuses to pick during game.

const FPS = 60;
const MS_PER_UPDATE = 1000 / FPS;

let canvas = document.getElementById('game-canvas');
let canvasContext = canvas.getContext('2d');

canvas.hCenter = canvas.width / 2;
canvas.vCenter = canvas.height / 2;

let previous = Date.now();
let lag = 0;

let XXXoffset = 5;
let bhSpeed = 8;

let debug = new Debugger();
debug.disable();

class Coord {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}

let audioEffects = new Effects();

let playerLeft = new Player("PlayerName");
let playerRight = new Player("AI");

let ball = new Ball('white', 10, randsign() * bhSpeed, randbound(-10, 10), new Coord(canvas.hCenter, canvas.vCenter));
let racketLeft = new Racket('white', 15, 100, new Coord(5, 50));
let racketRight = new Racket('white', 15, 100, new Coord(canvas.width - 20, 50));

let soundButton = new Button(20, 20, 2, new Coord(canvas.width - 20 - 50, 10));

let pauseText = new Text("white", "PAUSE", 194, "Dimitri, sans-serif", new Coord());
pauseText.pos.x = canvas.hCenter - (pauseText.width / 2);
pauseText.pos.y = canvas.vCenter - (pauseText.fontSize / 2);

let splashScreenTitle = new Text('white', 'PONG', 220, 'Dimitri, sans-serif', new Coord());
splashScreenTitle.pos.x = canvas.hCenter - (splashScreenTitle.width / 2);
splashScreenTitle.pos.y = (canvas.vCenter - (splashScreenTitle.fontSize / 2)) * 0.4;

let splashScreenBlink = new Text('white', 'Press SPACE to start', 30, 'Dimitri, sans-serif', new Coord());
splashScreenBlink.pos.x = canvas.hCenter - (splashScreenBlink.width / 2);
splashScreenBlink.pos.y = (canvas.vCenter * 1.3) - (splashScreenBlink.fontSize / 2);

let winScreenTitle = new Text('white', 'You won!', 180, 'Dimitri, sans-serif', new Coord());
winScreenTitle.pos.x = canvas.hCenter - (winScreenTitle.width / 2);
winScreenTitle.pos.y = canvas.vCenter - (winScreenTitle.fontSize / 2);

let loseScreenTitle = new Text('white', 'You lost', 180, 'Dimitri, sans-serif', new Coord());
loseScreenTitle.pos.x = canvas.hCenter - (loseScreenTitle.width / 2);
loseScreenTitle.pos.y = canvas.vCenter - (loseScreenTitle.fontSize / 2);

let loseWinScreenBlink = new Text('white', 'Press SPACE to restart', 30, 'Dimitri, sans-serif', new Coord());
loseWinScreenBlink.pos.x = canvas.hCenter - (loseWinScreenBlink.width / 2);
loseWinScreenBlink.pos.y = (canvas.vCenter * 1.3) - (loseWinScreenBlink.fontSize / 2);

let isSplashScreen = true;
let isLoseScreen = false;
let isWinScreen = false;
let isPaused = false;

function drawStaticScreen(titleText, blinkText) {
    canvasContext.drawFillRect('black', canvas.width, canvas.height, 0, 0);

    canvasContext.drawFillText(titleText.color, titleText.text, titleText.fontSize, titleText.fontFamily, titleText.pos.x, titleText.pos.y);

    let blinking = true;
    let freq = 1000;
    if (!blinking || Math.floor(Date.now() / freq) % 2) {
        canvasContext.drawFillText(blinkText.color, blinkText.text, blinkText.fontSize, blinkText.fontFamily, blinkText.pos.x, blinkText.pos.y);
    }
}

function render() {
    canvasContext.drawFillRect('black', canvas.width, canvas.height, 0, 0);

    canvasContext.drawStrokeRect('white', soundButton.width, soundButton.height, soundButton.pos.x, soundButton.pos.y);

    if (soundButton.clicked) {
        canvasContext.drawFillRect('white', soundButton.width, soundButton.height, soundButton.pos.x, soundButton.pos.y);
    }

    if (isSplashScreen) {
        drawStaticScreen(splashScreenTitle, splashScreenBlink);
        return;
    }

    if (isLoseScreen) {
        drawStaticScreen(loseScreenTitle, loseWinScreenBlink);
        return;
    }

    if (isWinScreen) {
        drawStaticScreen(winScreenTitle, loseWinScreenBlink);
        return;
    }

    if (isPaused) {
        canvasContext.drawFillText(
            pauseText.color, pauseText.text, pauseText.fontSize, pauseText.fontFamily,
            pauseText.pos.x, pauseText.pos.y);

        // return; // A return here would make everything else disappear when the game is paused.
    }

    canvasContext.drawFillText("white", playerLeft.getScore(), 24, "sans-serif", canvas.width / 4, 50);
    canvasContext.drawFillText("white", playerRight.getScore(), 24, "sans-serif", canvas.width - (canvas.width / 4), 50);

    canvasContext.drawLine('white', 4, [40, 40], new Coord(canvas.width / 2, 0), new Coord(canvas.width / 2, canvas.height), 0);

    canvasContext.drawFillRect(racketLeft.color, racketLeft.width, racketLeft.height, racketLeft.pos.x, racketLeft.pos.y);
    canvasContext.drawFillRect(racketRight.color, racketRight.width, racketRight.height, racketRight.pos.x, racketRight.pos.y);

    canvasContext.drawCirc('white', ball.radius, ball.pos.x, ball.pos.y);
}

function update() {
    if (isSplashScreen) return;
    if (isPaused) return;
    if (isLoseScreen) return;
    if (isWinScreen) return;

    ball.pos.x += ball.hSpeed;
    ball.pos.y += ball.vSpeed;

    // AI for the enemy racket.
    if (ball.pos.x < canvas.hCenter) {
        if (racketRight.center().y < canvas.vCenter) {
            if (((canvas.height / 2) - racketRight.center().y) > racketRight.speed) {
                racketRight.pos.y += racketRight.speed;
            } else {
                racketRight.moveToOrig();
            }
        } else if (racketRight.center().y > canvas.vCenter) {
            if ((racketRight.center().y - canvas.vCenter) > racketRight.speed) {
                racketRight.pos.y -= racketRight.speed;
            } else {
                racketRight.moveToOrig();
            }
        }
    } else if (ball.pos.x >= canvas.hCenter) {
        if (racketRight.center().y < ball.pos.y) {
            if ((ball.pos.y - racketRight.center().y) > racketRight.speed) {
                racketRight.pos.y += racketRight.speed;
            } else {
                racketRight.moveToRelative(ball.pos.y);
            }
        } else if (racketRight.center().y > ball.pos.y) {
            if ((racketRight.center().y - ball.pos.y) > racketRight.speed) {
                racketRight.pos.y -= racketRight.speed;
            } else {
                racketRight.moveToRelative(ball.pos.y);
            }
        }
    }

    // ***
    // Rackets collisions
    // ***
    // * Left racket
    // Racket top boundary
    if (racketLeft.pos.y <= 0) {
        racketLeft.pos.y = 5;
    }

    // Racket bottom boundary
    if (racketLeft.pos.y >= (canvas.height - racketLeft.height)) {
        racketLeft.pos.y = canvas.height - racketLeft.height - 5;
    }

    //* Right racket
    // Racket top boundary
    if (racketRight.pos.y <= 0) {
        racketRight.pos.y = 5;
    }

    // Racket bottom boundary
    if (racketRight.pos.y >= (canvas.height - racketRight.height)) {
        racketRight.pos.y = canvas.height - racketRight.height - 5;
    }

    // ***
    // Ball collisions
    // ***

    // TODO:#: Code replication here, remove it.
    // Left boundary
    if ((ball.pos.x - ball.radius) <= XXXoffset) {
        // It hit the player "goal". Reset it to the center.
        playerRight.updateScore();

        audioEffects.effects.lost.play();

        if (playerRight.getScore() >= 5) {
            isLoseScreen = true;

            return;
        }

        ball.restart();
    }

    // Right boundary
    if ((ball.pos.x + ball.radius) >= (canvas.width - XXXoffset)) {
        // It hit the AI "goal". Reset it to the center.
        playerLeft.updateScore();

        audioEffects.effects.lost.play();

        if (playerLeft.getScore() >= 5) {
            isWinScreen = true;

            return;
        }

        ball.restart();
    }
    // #:/

    // TODO:#: Code replication here, remove it.
    // Top boundary
    if ((ball.pos.y - ball.radius) <= XXXoffset) {
        audioEffects.effects.ball_bounce.play();

        ball.vSpeed = -ball.vSpeed;
    }

    // Bottom boundary
    if ((ball.pos.y + ball.radius) >= (canvas.height - XXXoffset)) {
        audioEffects.effects.ball_bounce.play();

        ball.vSpeed = -ball.vSpeed;
    }
    // #:/

    //* Hit the left racket
    // Hit the vertical edge
    if ((ball.pos.x - ball.radius) <= (racketLeft.width + XXXoffset)) {
        audioEffects.effects.ball_bounce.play();

        let relativeBallPos = ball.pos.y - racketLeft.pos.y;

        // Ball hit inside the racket
        if ((ball.pos.y >= racketLeft.pos.y) &&
          (ball.pos.y <= (racketLeft.pos.y + racketLeft.height))) {
            ball.hSpeed = -ball.hSpeed;
            ball.vSpeed = 30 * (((2 * relativeBallPos) / racketLeft.height) - 1);
        }
    }

    //* Hit the right racket
    // Hit the vertical edge
    if ((ball.pos.x + ball.radius) >= (canvas.width -(racketRight.width + XXXoffset))) {
        audioEffects.effects.ball_bounce.play();

        let relativeBallPos = ball.pos.y - racketRight.pos.y;

        // Ball hit inside the racket
        if ((ball.pos.y >= racketRight.pos.y) &&
          (ball.pos.y <= (racketRight.pos.y + racketRight.height))) {
            ball.hSpeed = -ball.hSpeed;
            ball.vSpeed = 30 * (((2 * relativeBallPos) / racketRight.height) - 1);
        }
    }
} // /update()

function game() {
    requestAnimationFrame(game);

    let current = Date.now();
    let elapsed = current - previous;
    previous = current;
    lag += elapsed;

    // Process input here

    while (lag >= MS_PER_UPDATE) {
        update();

        lag -= MS_PER_UPDATE;
    } // /game loop

    render();
}

(function() {
    canvas.addEventListener('mousemove', function(event) {
        if (isPaused) return;

        racketLeft.pos.y = getMousePosition(event).y - (racketLeft.height / 2);

        // ***
        // Rackets collisions
        // ***
        // * Left racket
        // Racket top boundary
        if (racketLeft.pos.y <= 0) {
            racketLeft.pos.y = 5;
        }

        // Racket bottom boundary
        if (racketLeft.pos.y >= (canvas.height - racketLeft.height)) {
            racketLeft.pos.y = canvas.height - racketLeft.height - 5;
        }

        //* Right racket
        // Racket top boundary
        if (racketRight.pos.y <= 0) {
            racketRight.pos.y = 5;
        }

        // Racket bottom boundary
        if (racketRight.pos.y >= (canvas.height - racketRight.height)) {
            racketRight.pos.y = canvas.height - racketRight.height - 5;
        }
    });

    document.addEventListener('keydown', function(event) {
        // Toggle pause
        if (event.key === 'p') {
            isPaused = !isPaused;
            audioEffects.effects.game_paused.play();

            debug.print("'p'-key down: Game paused.");
        }

        // Toggle mute
        if (event.key === 'm') {
            soundButton.click();
            audioEffects.toggleMuteAll();
        }

        // Space pressed
        if (event.key === ' ') {
            if (isSplashScreen) {
                isSplashScreen = false;
            }

            if (isLoseScreen || isWinScreen) {
                isLoseScreen = isWinScreen = false;
                ball.restart();
                playerRight.setScore(0);
                playerLeft.setScore(0);
            }
        }
    });

    canvas.addEventListener('click', function(event) {
        let mousePos = getMousePosition(event);

        // Check if the click happened inside the boundaries of the button.
        if ((mousePos.x >= soundButton.pos.x) &&
            (mousePos.x <= (soundButton.pos.x + soundButton.width))) {
            if ((mousePos.y >= soundButton.pos.y) &&
                (mousePos.y <= (soundButton.pos.y + soundButton.height))) {
                soundButton.click();
                audioEffects.toggleMuteAll();
            }
        }
    });

    game();
})();