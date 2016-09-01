class Effects {
    constructor() {
        this.effects = [];
        for (let i = 0; i < Effects.effectsNames.length; ++i) {
            this.effects[Effects.effectsNames[i]] =
                new Audio(Effects.effectsRoot + '/' + Effects.effectsNames[i] + '.ogg');
        }

    }

    muteAll() {
        for (let i = 0; i < Effects.effectsNames.length; ++i) {
            this.effects[Effects.effectsNames[i]].muted = true;
        }


    }

    unmuteAll() {
        for (let i = 0; i < Effects.effectsNames.length; ++i) {
            this.effects[Effects.effectsNames[i]].muted = false;
        }

    }

    toggleMuteAll() {
        for (let i = 0; i < Effects.effectsNames.length; ++i) {
            this.effects[Effects.effectsNames[i]].muted =
                !this.effects[Effects.effectsNames[i]].muted;
        }

    }
}

// Static data member of the class Effects.
Effects.effectsNames = ['lost', 'ball_bounce', 'game_paused'];
Effects.effectsRoot = 'sounds';