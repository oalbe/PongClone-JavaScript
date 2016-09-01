class Effects {
    constructor() {
        this.effects = [];
        for (var i = 0; i < Effects.effectsNames.length; ++i) {
            this.effects[Effects.effectsNames[i]] =
                new Audio(effectsRoot + '/' + Effects.effectsNames[i] + '.ogg');
        }

    }

    muteAll() {
        for (var i = 0; i < Effects.effectsNames.length; ++i) {
            this.effects[Effects.effectsNames[i]].muted = true;
        }


    }

    unmuteAll() {
        for (var i = 0; i < Effects.effectsNames.length; ++i) {
            this.effects[Effects.effectsNames[i]].muted = false;
        }

    }

    toggleMuteAll() {
        for (var i = 0; i < Effects.effectsNames.length; ++i) {
            this.effects[Effects.effectsNames[i]].muted =
                !this.effects[Effects.effectsNames[i]].muted;
        }

    }
}

// Static data member of the class Effects.
Effects.effectsNames = ['lost', 'ball_bounce', 'game_paused'];