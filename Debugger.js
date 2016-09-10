class Debugger {
    constructor() {
        this.isEnabled = false;
    }

    enable() {
        this.isEnabled = true;
    }

    disable() {
        this.isEnabled = false;
    }

    print(value, content = false) {
        if (this.isEnabled) {
            let res = value;
            if (content) {
                res += ': ' + content;
            }

            console.log(res);
        }
    }
}