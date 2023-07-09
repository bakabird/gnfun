export default class CountdownRunner {
    get bindedCountdown() {
        return this.countdown.bind(this);
    }
    constructor(_countdown, _run) {
        this._countdown = _countdown;
        this._run = _run;
    }
    countdown() {
        var _a;
        this._countdown -= 1;
        if (this._countdown <= 0) {
            (_a = this._run) === null || _a === void 0 ? void 0 : _a.call(this);
            this._run = undefined;
        }
    }
}
