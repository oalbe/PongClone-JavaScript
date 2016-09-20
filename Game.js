class Game {
    constructor(canvas, canvasContext) {
        this._FPS = 60;
        this._MS_PER_UPDATE = 1000 / this._FPS;
        this._lag = 0;

        this._isPaused = false;

        this.isSplashScreen = true;
        this.isLoseScreen = false;
        this.isWinScreen = false;

        this.canvas = canvas;
        this.canvasContext = canvasContext;

        this.audioEffects = new Effects();
        this.playerLeft = new Player('PlayerName');
        this.playerRight = new Player('AI');
        this.ball = new Ball('white', 10, randsign() * Ball.basehSpeed, randbound(-10, 10), new Coord(this.canvas.hCenter, this.canvas.vCenter));

        this.racketLeft = new Racket('white', 15, 100, new Coord(Racket.offset, 50));
        this.racketRight = new Racket('white', 15, 100, new Coord(this.canvas.width - 15 - Racket.offset, 50));

        this.soundButton = new Button(20, 20, 2, new Coord(this.canvas.width - 20 - 50, 10));

        this.pauseText = new Text('white', 'PAUSE', 194, 'Dimitri, sans-serif', new Coord());
        this.pauseText.pos.x = this.canvas.hCenter - (this.pauseText.width / 2);
        this.pauseText.pos.y = this.canvas.vCenter - (this.pauseText.fontSize / 2);

        this.splashScreenTitle = new Text('white', 'PONG', 220, 'Dimitri, sans-serif', new Coord());
        this.splashScreenTitle.pos.x = this.canvas.hCenter - (this.splashScreenTitle.width / 2);
        this.splashScreenTitle.pos.y = (this.canvas.vCenter - (this.splashScreenTitle.fontSize / 2)) * 0.4;

        this.splashScreenBlink = new Text('white', 'Press SPACE to start', 30, 'Dimitri, sans-serif', new Coord());
        this.splashScreenBlink.pos.x = this.canvas.hCenter - (this.splashScreenBlink.width / 2);
        this.splashScreenBlink.pos.y = (this.canvas.vCenter * 1.3) - (this.splashScreenBlink.fontSize / 2);

        this.winScreenTitle = new Text('white', 'You won!', 180, 'Dimitri, sans-serif', new Coord());
        this.winScreenTitle.pos.x = this.canvas.hCenter - (this.winScreenTitle.width / 2);
        this.winScreenTitle.pos.y = this.canvas.vCenter - (this.winScreenTitle.fontSize / 2);

        this.loseScreenTitle = new Text('white', 'You lost', 180, 'Dimitri, sans-serif', new Coord());
        this.loseScreenTitle.pos.x = this.canvas.hCenter - (this.loseScreenTitle.width / 2);
        this.loseScreenTitle.pos.y = this.canvas.vCenter - (this.loseScreenTitle.fontSize / 2);

        this.loseWinScreenBlink = new Text('white', 'Press SPACE to restart', 30, 'Dimitri, sans-serif', new Coord());
        this.loseWinScreenBlink.pos.x = this.canvas.hCenter - (this.loseWinScreenBlink.width / 2);
        this.loseWinScreenBlink.pos.y = (this.canvas.vCenter * 1.3) - (this.loseWinScreenBlink.fontSize / 2);
    }

    isPaused() {
        return this._isPaused;
    }

    togglePause() {
        this._isPaused = !this._isPaused;
    }

    loop(previous) {
        let current = Date.now();
        let elapsed = current - previous;
        previous = current;
        this._lag += elapsed;

        requestAnimationFrame(this.loop.bind(this, previous));

        // Process input here

        while (this._lag >= this._MS_PER_UPDATE) {
            this.update();

            this._lag -= this._MS_PER_UPDATE;
        }

        this.render();
    }

    drawStaticScreen(titleText, blinkText) {
        this.canvasContext.drawFillRect('black', this.canvas.width, this.canvas.height, 0, 0);

        this.canvasContext.drawFillText(titleText.color, titleText.text, titleText.fontSize, titleText.fontFamily, titleText.pos.x, titleText.pos.y);

        // TODO: Consider the use cases for stopping the blinking in the static screens.
        //       If none are found, just remove 'blinking' for good.
        let blinking = true;
        let freq = 1000;
        if (!blinking || Math.floor(Date.now() / freq) % 2) {
            this.canvasContext.drawFillText(blinkText.color, blinkText.text, blinkText.fontSize, blinkText.fontFamily, blinkText.pos.x, blinkText.pos.y);
        }
    }

    update() {
        if (this.isSplashScreen) return;
        if (this.isPaused()) return;
        if (this.isLoseScreen) return;
        if (this.isWinScreen) return;

        this.ball.pos.x += this.ball.hSpeed;
        this.ball.pos.y += this.ball.vSpeed;

        // AI for the enemy racket.
        if (this.ball.pos.x < this.canvas.hCenter) {
            if (this.racketRight.center().y < this.canvas.vCenter) {
                if (((this.canvas.height / 2) - this.racketRight.center().y) > this.racketRight.speed) {
                    this.racketRight.pos.y += this.racketRight.speed;
                } else {
                    this.racketRight.moveToOrig();
                }
            } else if (this.racketRight.center().y > this.canvas.vCenter) {
                if ((this.racketRight.center().y - this.canvas.vCenter) > this.racketRight.speed) {
                    this.racketRight.pos.y -= this.racketRight.speed;
                } else {
                    this.racketRight.moveToOrig();
                }
            }
        } else if (this.ball.pos.x >= this.canvas.hCenter) {
            if (this.racketRight.center().y < this.ball.pos.y) {
                if ((this.ball.pos.y - this.racketRight.center().y) > this.racketRight.speed) {
                    this.racketRight.pos.y += this.racketRight.speed;
                } else {
                    this.racketRight.moveToRelative(this.ball.pos.y);
                }
            } else if (this.racketRight.center().y > this.ball.pos.y) {
                if ((this.racketRight.center().y - this.ball.pos.y) > this.racketRight.speed) {
                    this.racketRight.pos.y -= this.racketRight.speed;
                } else {
                    this.racketRight.moveToRelative(this.ball.pos.y);
                }
            }
        }

        // ***
        // Ball collisions
        // ***
        // TODO:#: Code duplication here, remove it.
        // Left boundary
        if ((this.ball.pos.x - this.ball.radius) <= Racket.offset) {
            // It hit the player "goal". Reset it to the center.
            this.playerRight.updateScore();

            this.audioEffects.effects.lost.play();

            if (this.playerRight.getScore() >= 5) {
                this.isLoseScreen = true;

                return;
            }

            this.ball.restart();
        }

        // Right boundary
        if ((this.ball.pos.x + this.ball.radius) >= (this.canvas.width - Racket.offset)) {
            // It hit the AI "goal". Reset it to the center.
            this.playerLeft.updateScore();

            this.audioEffects.effects.lost.play();

            if (this.playerLeft.getScore() >= 5) {
                this.isWinScreen = true;

                return;
            }

            this.ball.restart();
        }
        // #:/

        // TODO:#: Code duplication here, remove it.
        // Top boundary
        if ((this.ball.pos.y - this.ball.radius) <= Racket.offset) {
            this.audioEffects.effects.ball_bounce.play();

            this.ball.vSpeed = -this.ball.vSpeed;
        }

        // Bottom boundary
        if ((this.ball.pos.y + this.ball.radius) >= (this.canvas.height - Racket.offset)) {
            this.audioEffects.effects.ball_bounce.play();

            this.ball.vSpeed = -this.ball.vSpeed;
        }
        // #:/

        // TODO:#: Code duplication here, remove it.
        //* Hit the left racket
        // Hit the vertical edge
        if ((this.ball.pos.x - this.ball.radius) <= (this.racketLeft.width + Racket.offset)) {
            this.audioEffects.effects.ball_bounce.play();

            let relativeBallPos = this.ball.pos.y - this.racketLeft.pos.y;

            // Ball hit inside the racket
            if ((this.ball.pos.y >= this.racketLeft.pos.y) &&
              (this.ball.pos.y <= (this.racketLeft.pos.y + this.racketLeft.height))) {
                this.ball.hSpeed = -this.ball.hSpeed;
                this.ball.vSpeed = 30 * (((2 * relativeBallPos) / this.racketLeft.height) - 1);
            }
        }

        //* Hit the right racket
        // Hit the vertical edge
        if ((this.ball.pos.x + this.ball.radius) >= (this.canvas.width -(this.racketRight.width + Racket.offset))) {
            this.audioEffects.effects.ball_bounce.play();

            let relativeBallPos = this.ball.pos.y - this.racketRight.pos.y;

            // Ball hit inside the racket
            if ((this.ball.pos.y >= this.racketRight.pos.y) &&
              (this.ball.pos.y <= (this.racketRight.pos.y + this.racketRight.height))) {
                this.ball.hSpeed = -this.ball.hSpeed;
                this.ball.vSpeed = 30 * (((2 * relativeBallPos) / this.racketRight.height) - 1);
            }
        }
        // #:/
    } // /update()

    render() {
        this.canvasContext.drawFillRect('black', this.canvas.width, this.canvas.height, 0, 0);

        let audioIcon = new Image();
        audioIcon.src = 'images/audio_on.svg';

        if (this.soundButton.clicked) {
            audioIcon.src = 'images/audio_off.svg';
        }

        this.canvasContext.drawImage(audioIcon, this.soundButton.pos.x, this.soundButton.pos.y);

        if (this.isSplashScreen) {
            this.drawStaticScreen(this.splashScreenTitle, this.splashScreenBlink);
            return;
        }

        if (this.isLoseScreen) {
            this.drawStaticScreen(this.loseScreenTitle, this.loseWinScreenBlink);
            return;
        }

        if (this.isWinScreen) {
            this.drawStaticScreen(this.winScreenTitle, loseWinScreenBlink);
            return;
        }

        if (this.isPaused()) {
            this.canvasContext.drawFillText(
                this.pauseText.color, this.pauseText.text, this.pauseText.fontSize, this.pauseText.fontFamily,
                this.pauseText.pos.x, this.pauseText.pos.y
            );

            // return; // A return here would make everything else disappear when the game is paused.
        }

        this.canvasContext.drawFillText(
            'white', this.playerLeft.getScore(), 24, 'sans-serif', this.canvas.width / 4, 50);
        this.canvasContext.drawFillText(
            'white', this.playerRight.getScore(), 24, 'sans-serif', this.canvas.width - (this.canvas.width / 4), 50);

        this.canvasContext.drawLine(
            'white', 4, [40, 40], new Coord(this.canvas.hCenter, 0), new Coord(this.canvas.hCenter, this.canvas.height), 0);

        this.canvasContext.drawFillRect(
            this.racketLeft.color, this.racketLeft.width, this.racketLeft.height, this.racketLeft.pos.x, this.racketLeft.pos.y);
        this.canvasContext.drawFillRect(
            this.racketRight.color, this.racketRight.width, this.racketRight.height, this.racketRight.pos.x, this.racketRight.pos.y);

        this.canvasContext.drawCirc('white', this.ball.radius, this.ball.pos.x, this.ball.pos.y);
    } // /render()
}