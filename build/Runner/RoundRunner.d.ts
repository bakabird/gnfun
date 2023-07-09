export default class RoundRunner {
    private _steps;
    get over(): boolean;
    constructor();
    append(step: Function): void;
    reverse(): void;
    runRound(roundNum: number): void;
    runAll(): void;
    /**
     * 生成一个执行体。
     * @param roundNum 每一 Round 执行多少任务。roundNum < 1 时表示一次性全部执行完。
     * @param onRest Round 结束后还有剩余任务时调用
     * @param onEnd Round 结束后没有剩余任务时调用
     * @returns
     */
    produceExecuteBody(roundNum: number, onRest: (excuteBody: Function) => void, onEnd: (self: RoundRunner) => void): () => void;
}
