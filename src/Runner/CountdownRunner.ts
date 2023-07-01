export default class CountdownRunner {
    public get bindedCountdown() {
        return this.countdown.bind(this);
    }

    constructor(private _countdown: number, private _run: Function | undefined) {
    }
    public countdown() {
        this._countdown -= 1;
        if (this._countdown <= 0) {
            this._run?.()
            this._run = undefined;
        }
    }
}