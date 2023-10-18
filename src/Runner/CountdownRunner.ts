export default class CountdownRunner {
    /**
     * bind 了 CountdownRunner 自己的 countdown 方法。
     */
    public get bindedCountdown() {
        return this.countdown.bind(this);
    }

    /**
     *
     * @param _countdown 倒数次数
     * @param _run 倒数到 0 时执行的方法
     */
    constructor(private _countdown: number, private _run: Function | undefined) {
    }

    public inc() {
        this._countdown += 1;
    }

    /**
     * 倒数一次，如果倒数到 0 则执行 run 方法。
     */
    public countdown() {
        this._countdown -= 1;
        if (this._countdown <= 0) {
            this._run?.()
            this._run = undefined;
        }
    }
}