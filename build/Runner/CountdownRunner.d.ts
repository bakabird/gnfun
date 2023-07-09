export default class CountdownRunner {
    private _countdown;
    private _run;
    get bindedCountdown(): () => void;
    constructor(_countdown: number, _run: Function | undefined);
    countdown(): void;
}
