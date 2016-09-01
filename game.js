/* jshint esnext: true */
const FPS = 60;
const MS_PER_UPDATE = 1000 / FPS;

const effectsRoot = 'sounds';

var canvas = document.getElementById('game-canvas');
var canvasContext = canvas.getContext('2d');

canvas.hCenter = canvas.width / 2;
canvas.vCenter = canvas.height / 2;

var previous = Date.now();
var lag = 0;

var XXXoffset = 5;
var bhSpeed = 8;

var isPaused = false;

var debug = new Debugger();
debug.enable();

class Coord {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}

var audioEffects = new Effects();

var playerLeft = new Player("PlayerName");
var playerRight = new Player("AI");

var ball = new Ball('white', 10, randsign() * bhSpeed, randbound(-10, 10), new Coord(canvas.hCenter, canvas.vCenter));
var racketLeft = new Racket('white', 15, 100, new Coord(5, 50));
var racketRight = new Racket('white', 15, 100, new Coord(canvas.width - 20, 50));

var soundButton = new Button(20, 20, 2, new Coord(canvas.width - 20 - 50, 10));

var pauseText = new Text("white", "PAUSE", 194, "sans-serif", new Coord());
pauseText.pos.x = canvas.hCenter - (pauseText.width / 2);
pauseText.pos.y = canvas.vCenter - (pauseText.fontSize / 2);

var splashScreenTitle = new Text('white', 'PONG', 220, 'Dimitri, sans-serif', new Coord());
splashScreenTitle.pos.x = canvas.hCenter - (splashScreenTitle.width / 2);
splashScreenTitle.pos.y = (canvas.vCenter - (splashScreenTitle.fontSize / 2)) * 0.4;

var splashScreenBlink = new Text('white', 'Press SPACE to start', 30, 'Dimitri, sans-serif', new Coord());
splashScreenBlink.pos.x = canvas.hCenter - (splashScreenBlink.width / 2);
splashScreenBlink.pos.y = (canvas.vCenter * 1.3) - (splashScreenBlink.fontSize / 2);

var isSplashScreen = true;

function splashScreen() {
    canvasContext.drawFillRect('black', canvas.width, canvas.height, 0, 0);

    canvasContext.drawFillText(splashScreenTitle.color, splashScreenTitle.text, splashScreenTitle.fontSize, splashScreenTitle.fontFamily, splashScreenTitle.pos.x, splashScreenTitle.pos.y);

    var blinking = true;
    var freq = 1000;
    if (!blinking || Math.floor(Date.now() / freq) % 2) {
        canvasContext.drawFillText(splashScreenBlink.color, splashScreenBlink.text, splashScreenBlink.fontSize, splashScreenBlink.fontFamily, splashScreenBlink.pos.x, splashScreenBlink.pos.y);
    }
}

function render() {
    canvasContext.drawFillRect('black', canvas.width, canvas.height, 0, 0);

    canvasContext.drawStrokeRect('white', soundButton.width, soundButton.height, soundButton.pos.x, soundButton.pos.y);

    if (soundButton.clicked) {
        canvasContext.drawFillRect('white', soundButton.width, soundButton.height, soundButton.pos.x, soundButton.pos.y);
    }

    // Display splashscreen and nothing else.
    if (isSplashScreen) {
        splashScreen();

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
    if (isSplashScreen) {
        return;
    }

    if (isPaused) {
        return;
    }

    ball.pos.x = ball.pos.x + ball.hSpeed;
    ball.pos.y = ball.pos.y + ball.vSpeed;

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
    // Left boundary
    if ((ball.pos.x) < 0) {
        // It hit the player "goal". Reset it to the center.
        playerRight.updateScore();

        audioEffects.effects.lost.play();

        ball.restart();
    }

    // Right boundary
    if ((ball.pos.x + ball.radius) >= canvas.width) {
        // It hit the AI "goal". Reset it to the center.
        playerLeft.updateScore();

        audioEffects.effects.lost.play();

        ball.restart();
    }

    // Top boundary
    if ((ball.pos.y - ball.radius) <= 0) {
        audioEffects.effects.ball_bounce.play();

        ball.vSpeed = -ball.vSpeed;
    }

    // Bottom boundary
    if ((ball.pos.y + ball.radius) >= canvas.height) {
        audioEffects.effects.ball_bounce.play();

        ball.vSpeed = -ball.vSpeed;
    }

    // TODO: Tune this.
    var bvSpeed = -5;

    // Position of the ball relative to the racketLeft.
    var ballPosRelative = bvSpeed + (ball.pos.y - (racketLeft.pos.y + racketLeft.height));

    //* Hit the left racket
    // Hit the vertical edge
    if ((ball.pos.x - ball.radius) <= (racketLeft.width + XXXoffset)) {
        audioEffects.effects.ball_bounce.play();

        // Check if it hit the uppermost quarter
        if ((ball.pos.y >= racketLeft.pos.y) &&
            (ball.pos.y <= (racketLeft.pos.y + (racketLeft.height / 4)))) {
            debug.print("RacketLeft: COLLISION UPPER FIRST!");
            ball.hSpeed = -ball.hSpeed;

            ball.vSpeed = ballPosRelative * 0.33;
        }

        // Check if it hit the upper middle quarter
        if ((ball.pos.y > (racketLeft.pos.y + (racketLeft.height / 4))) &&
            (ball.pos.y <= (racketLeft.pos.y + (racketLeft.height / 2)))) {
            debug.print("RacketLeft: COLLISION UPPER MIDDLE!");
            ball.hSpeed = -ball.hSpeed;
            ball.vSpeed = ballPosRelative * 0.16;
        }

        // Check if it hit the lower middle quarter
        if ((ball.pos.y > (racketLeft.pos.y + (racketLeft.height / 2)) &&
            (ball.pos.y <= (racketLeft.pos.y + ((racketLeft.height / 4) * 3))))) {
            debug.print("RacketLeft: COLLISION LOWER MIDDLE!");
            ball.hSpeed = -ball.hSpeed;
            ball.vSpeed = -ballPosRelative * 0.16;
        }

        // Check if it hit the lowermost quarter
        if ((ball.pos.y > (racketLeft.pos.y + ((racketLeft.height / 4) * 3)) &&
            (ball.pos.y <= (racketLeft.pos.y + racketLeft.height)))) {
            debug.print("RacketLeft: COLLISION LOWER FIRST!");
            ball.hSpeed = -ball.hSpeed;
            ball.vSpeed = -ballPosRelative * 0.33;
        }
    }

    // Hit the horizontal lower edge
    // if ((ball.pos.y - ball.radius) <= (racketLeft.pos.y + racketLeft.height)) {
    //     if ((ball.pos.x + ball.radius) <= 20) {
    //         console.log("COLLISION LOWER SIDE!");
    //         // ball.vSpeed = -ball.vSpeed;
    //     }
    // }

    //* Hit the right racket
    // Hit the vertical edge
    if ((ball.pos.x + ball.radius) >= (canvas.width -(racketRight.width + XXXoffset))) {
        audioEffects.effects.ball_bounce.play();

        // Check if it hit the uppermost quarter
        if ((ball.pos.y >= racketRight.pos.y) &&
            (ball.pos.y <= (racketRight.pos.y + (racketRight.height / 4)))) {
            debug.print("RacketRight: COLLISION UPPER FIRST!");
            ball.hSpeed = -ball.hSpeed;
        }

        // Check if it hit the upper middle quarter
        if ((ball.pos.y > (racketRight.pos.y + (racketRight.height / 4))) &&
            (ball.pos.y <= (racketRight.pos.y + (racketRight.height / 2)))) {
            debug.print("RacketRight: COLLISION UPPER MIDDLE!");
            ball.hSpeed = -ball.hSpeed;
        }

        // Check if it hit the lower middle quarter
        if ((ball.pos.y > (racketRight.pos.y + (racketRight.height / 2)) &&
            (ball.pos.y <= (racketRight.pos.y + ((racketRight.height / 4) * 3))))) {
            debug.print("RacketRight: COLLISION LOWER MIDDLE!");
            ball.hSpeed = -ball.hSpeed;
        }

        // Check if it hit the lowermost quarter
        if ((ball.pos.y > (racketRight.pos.y + ((racketRight.height / 4) * 3)) &&
            (ball.pos.y <= (racketRight.pos.y + racketRight.height)))) {
            debug.print("RacketRight: COLLISION LOWER FIRST!");
            ball.hSpeed = -ball.hSpeed;
        }
    }

    // Hit the horizontal lower edge
    // if ((ball.pos.y - ball.radius) < (racketRight.pos.y + racketRight.height)) {
    //     if ((ball.pos.x + ball.radius) <= 20) {
    //         console.log("COLLISION LOWER SIDE!");
    //         // ball.hSpeed = ball.hSpeed / 2;
    //         ball.vSpeed = -ball.vSpeed;
    //     }
    // }
} // /update()

function game() {
    requestAnimationFrame(game);

    var current = Date.now();
    var elapsed = current - previous;
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

        // Space pressed
        if (event.key === " ") {
            if (isSplashScreen) {
                isSplashScreen = false;
                console.log('SPACE PRESSED');
            }
        }
    });

    canvas.addEventListener('click', function(event) {
        var mousePos = getMousePosition(event);

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