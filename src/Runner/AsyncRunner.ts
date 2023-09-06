enum StepStatu {
    Idle,
    Pending,
    Stop,
    Fulfilled,
}

type Step = (call: () => void) => void;

/// <summary>
/// 一系列的 Action 依次执行
/// </summary>
export default class AsyncRunner {
    public statu: StepStatu = StepStatu.Idle;

    private m_quene: Array<Step>;
    private m_onEnd: null | (() => void);

    constructor() {
        this.m_quene = new Array<Step>();
        this.m_onEnd = null;
    }

    /**
     * 在队列末尾添加一个步骤
     * @param step 可以是一个步骤，也可以是一个步骤数组。如果是步骤数组，那么这些步骤会并行执行，并且这些步骤全都结束后，才会执行下一个步骤。
     */
    public Then(step: Step | Step[]): void {
        if (step instanceof Array) {
            let taskNum = step.length + 1;
            this.m_quene.push((complete) => {
                let taskDone = () => {
                    taskNum--;
                    if (taskNum < 1) complete();
                }
                step.forEach(t => { t(taskDone) })
                taskDone();
            })
        } else {
            this.m_quene.push(step);
        }
    }

    /**
     * 开始执行队列中的步骤
     * @param complete 所有步骤执行完毕后调用
     */
    public Start(complete: () => void): void {
        this.m_onEnd = complete;
        if (this.statu == StepStatu.Idle) {
            this.statu = StepStatu.Pending;
            this._Next();
        }
    }

    /**
     * 停止执行队列中的步骤
     */
    public Stop(): void {
        if (this.statu == StepStatu.Pending) {
            this.statu = StepStatu.Stop;
        }
    }

    private _Next(): void {
        if (this.statu == StepStatu.Pending) {
            if (this.m_quene.length > 0) {
                this.m_quene.shift()!(this._Next.bind(this));
            } else {
                this.m_onEnd?.();
                this.m_onEnd = null;
                this.statu = StepStatu.Fulfilled;
            }
        }
    }
}