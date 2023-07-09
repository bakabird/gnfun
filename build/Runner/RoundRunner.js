import { FreeList } from "../Collection/FreeList";
export default class RoundRunner {
    get over() {
        return this._steps.length == 0;
    }
    constructor() {
        this._steps = new FreeList();
    }
    append(step) {
        this._steps.push(step);
    }
    reverse() {
        this._steps.unsafeReverse();
    }
    runRound(roundNum) {
        let count = 0;
        let tmp;
        this._steps.foreach_safe(() => {
            count++;
            // console.log(count)
            // console.log(this._steps.length)
            tmp = this._steps.shift();
            tmp();
            // console.log(this._steps.length)
            return count < roundNum;
        });
    }
    runAll() {
        while (this._steps.length != 0) {
            this._steps.shift()();
        }
    }
    /**
     * 生成一个执行体。
     * @param roundNum 每一 Round 执行多少任务。roundNum < 1 时表示一次性全部执行完。
     * @param onRest Round 结束后还有剩余任务时调用
     * @param onEnd Round 结束后没有剩余任务时调用
     * @returns
     */
    produceExecuteBody(roundNum, onRest, onEnd) {
        const excuteBody = () => {
            if (roundNum > 0) {
                this.runRound(roundNum);
            }
            else {
                this.runAll();
            }
            if (!this.over) {
                onRest(excuteBody);
            }
            else {
                onEnd(this);
            }
        };
        return excuteBody;
    }
}