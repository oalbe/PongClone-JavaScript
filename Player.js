class Player {
    constructor(name) {
        this.name = name;
        this._score = 0;
    }

    setScore(newScore) {
        this._score = newScore;
    }

    getScore() {
        return this._score.toString();
    }

    updateScore() {
        ++this._score;
    }
}