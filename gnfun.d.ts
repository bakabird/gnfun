// Generated by dts-bundle v0.7.3

declare module 'gnfun' {
    export { FreeList } from "gnfun/Collection/FreeList";
    export { PoolModule } from "gnfun/Module/PoolModule";
    import Shake2DModule from "gnfun/Module/Shake2DModule";
    import CountdownRunner from "gnfun/Runner/CountdownRunner";
    import RoundRunner from "gnfun/Runner/RoundRunner";
    import AsyncRunner from "gnfun/Runner/AsyncRunner";
    export { easyEncode, deepClone, remap, emptyString, objectValues, getEnumName, enumValues, enumKeys, className, isNull, notNull, removeNullKeys, toNumber, random, randomInt, randomIntArr, pick, pickWeights, pickWeightsBy, arrayFindIndexAll, arrayIncludes, arrayRemove, arrayRemoveAll, arrayRemoveFirst, } from "gnfun/Util";
    export { CountdownRunner };
    export { RoundRunner };
    export { AsyncRunner };
    export { Shake2DModule };
}

declare module 'gnfun/Collection/FreeList' {
    import { ILoopFunction } from "gnfun/Collection/ILoopFunction";
    /**
        * iterator of FreeList
        */
    export interface IFreeListIterator<T> {
            /**
                * check if any next element
                */
            hasNext(): boolean;
            /**
                * get next any element and move to next
                */
            getNext(): T | undefined;
            /**
                * get next element but DONOT move to next
                */
            peekNext(): T | undefined;
            /**
                * move to next
                */
            moveNext(): void;
            /**
                * the index of the next element
                */
            readonly nextIndex: number;
    }
    export class FreeListIterator<T> implements IFreeListIterator<T> {
            constructor(list: FreeList<T>);
            hasNext(): boolean;
            peekNext(): T | undefined;
            getNext(): T | undefined;
            moveNext(): void;
            get nextIndex(): number;
            get _nextIndex(): number;
            set _nextIndex(value: number);
    }
    /**
        * 一个自由的list，在使用遍历器遍历的过程中，可以删除任意元素
        */
    export class FreeList<T> {
            constructor(ary?: Array<T>);
            /**
                * re-get the iterator of list
                */
            get it(): IFreeListIterator<T>;
            /**
                * begin a safe visit with iterator
                * @returns iterator for visiting
                */
            beginVisit(): IFreeListIterator<T>;
            /**
                * End a visit
                * @param iit
                */
            endVisit(iit: IFreeListIterator<T>): void;
            /**
                * elm count of list
                */
            get size(): number;
            /**
                * elm count of list
                */
            get length(): number;
            /**
                * return elm at index of i
                */
            at(i: number): T | undefined;
            /**
                * 返回列表的第一个元素，失败就返回空
                */
            get front(): T | undefined;
            /**
                * 返回列表的最后一个元素，失败就返回空
                */
            get back(): T | undefined;
            /**
                * add t at the end of list
                * @param t
                */
            push(t: T): number;
            /**
                * remove the last elm
                */
            pop(): T | undefined;
            /**
                * add t at the front of list
                * @param t
                */
            unshift(t: T): number;
            /**
                * remove elm at the front of list
                */
            shift(): T | undefined;
            /**
                * 查找给定元素在列表中的索引，失败返回-1
                * @param t 待查找元素
                * @param startIdx 开始查找位置，可选，默认0
                * @returns 指定元素在列表中的索引，没有找到返回-1
                */
            indexOf(t: T, startIdx?: number): number;
            /**
                * 查找符合条件的元素在列表中的索引，失败返回-1
                * @param condition 添加判断函数，返回true表示符合条件
                * @param startIdx 开始查找位置，可选，默认0
                * @returns （第一个）符合条件的元素在列表中的索引，没有找到返回-1
                */
            indexIf(condition: ILoopFunction<T>, startIdx?: number): number;
            /**
                * 查找第一个符合条件的元素，返回元素本身
                * @param condition 条件判断函数
                * @returns （第一个）符合条件的函数，没有找到返回空
                */
            findFirstIf(condition: (t: T) => boolean): T | undefined;
            /**
                * 移除给定元素
                * @param t 待移除的元素
                * @returns 移除成功返回被移除的元素，移除失败返回空
                */
            remove(t: T): T | undefined;
            /**
                * 逆转数组
                */
            unsafeReverse(): void;
            /**
                * 移除给定位置的元素
                * @param idx 待移除的元素的位置
                * @returns 移除成功返回被移除的元素，移除失败返回空
                */
            removeAt(idx: number): T | undefined;
            splice(startIdx: number, len: number): T[] | undefined;
            /**
                * 移除第一个符合条件的元素
                */
            removeFirstIf(callback: (t: T) => boolean, startIdx?: number): T | undefined;
            /**
                * 移除所有符合条件的元素
                */
            removeIf(callback: (t: T) => boolean): void;
            /**
                * 插入元素
                */
            insert(t: T, idx: number): number;
            /**
                * 遍历元素，遍历期间不能删除元素（否则行为未知）
                * @param loop 遍历函数，返回false表示退出遍历，返回其它继续遍历
                * @param startIdx 开始遍历索引，可选，默认从0开始遍历
                * @return 是否完全遍历，返回false表示中间退出了
                */
            foreach_unsafe(loop: ILoopFunction<T>, startIdx?: number): boolean;
            /**
                * 遍历元素，遍历期间可以任意添加删除元素
                * @param loop 遍历函数，返回false表示退出遍历
                * @param startIdx 遍历开始索引，可选，默认0
                * @return 是否完全遍历，返回false表示中间退出了
                */
            foreach(loop: ILoopFunction<T>, startIdx?: number): boolean;
            /**
                * 遍历元素（绝对安全版本），遍历期间可以任意添加删除元素
                * @param loop 遍历函数，返回false表示退出遍历
                * @param startIdx 遍历开始索引，可选，默认0
                * @return 是否完全遍历，返回false表示中间退出了
                */
            foreach_safe(loop: ILoopFunction<T>, startIdx?: number): boolean;
            map<Rlt>(mapFunc: (item: T, index: number) => Rlt): Array<Rlt>;
            /**
                * 清理列表
                */
            clear(): void;
            /**
                * 列表克隆
                * @param from 待克隆的起始元素索引，可选，默认0
                * @param len 克隆数量，可选，不填表示从from拷贝到列表末尾
                * @returns 克隆列表
                */
            clone(from?: number, len?: number): FreeList<T>;
            /**
                * 列表拷贝
                * @param dst 目标列表
                * @param from 其实元素索引，可选，默认0
                * @param len 拷贝数量，可选，不填表示从from拷贝到列表末尾
                * @returns 目标列表
                */
            copyTo(dst: FreeList<T>, from?: number, len?: number): FreeList<T>;
            report(): void;
    }
}

declare module 'gnfun/Module/PoolModule' {
    /**
        * 可以被任意组合使用的对象池。
        */
    export class PoolModule<T> {
            /**
                * 创建一个对象池
                * @param _ctor 构造新对象时执行的方法。
                * @param _dtor 回收对象时执行的方法。
                */
            constructor(_ctor: () => T, _dtor?: ((o: T) => void) | undefined);
            /**
                * 从对象池中取出一个对象
                * @returns 一个对象
                */
            alloc(): T;
            /**
                * 回收一个对象
                * @param o 回收对象
                */
            free(o: T): void;
    }
}

declare module 'gnfun/Module/Shake2DModule' {
    type Vec2 = {
            x: number;
            y: number;
    };
    export default class Shake2DModule {
            /**
                *
                * @param magnitude 抖动力度
                * @param duration 抖动持续时间
                * @param speed 抖动速度
                * @param shaketype 抖动方式
                * @param RandomRange 随机因子的范围
                * @param onGetOriginal 获取抖动原点时调用
                * @param onShake 生成新的抖动位置时调用
                */
            constructor(magnitude: number, duration: number, speed: number, shaketype: "smooth" | "smoothCircle" | "smoothHalfCircle" | "perlinNoise" | "random", RandomRange: number, onGetOriginal: () => Vec2, onShake: (v2: Vec2) => void);
            /**
                * 0 ~ 1
                * @returns 返回当前进度
                */
            get ratio(): number;
            /**
                * 推进当前进度
                */
            set ratio(v: number);
    }
    export {};
}

declare module 'gnfun/Runner/CountdownRunner' {
    export default class CountdownRunner {
            /**
                * bind 了 CountdownRunner 自己的 countdown 方法。
                */
            get bindedCountdown(): () => void;
            /**
                *
                * @param _countdown 倒数次数
                * @param _run 倒数到 0 时执行的方法
                */
            constructor(_countdown: number, _run: Function | undefined);
            inc(): void;
            /**
                * 倒数一次，如果倒数到 0 则执行 run 方法。
                */
            countdown(): void;
    }
}

declare module 'gnfun/Runner/RoundRunner' {
    export default class RoundRunner {
            get over(): boolean;
            constructor();
            /**
                * 添加一个任务
                * @param step
                */
            append(step: Function): void;
            /**
                * 反转剩余任务队列
                */
            reverse(): void;
            /**
                * 执行一轮任务
                * @param roundNum 一轮执行多少任务
                */
            runRound(roundNum: number): void;
            /**
                * 执行所有任务
                */
            runAll(): void;
            /**
                * 生成一个执行体。
                * @param roundNum 每一 Round 执行多少任务。roundNum < 1 时表示一次性全部执行完。
                * @param onRest Round 结束后还有剩余任务时调用
                * @param onEnd Round 结束后没有剩余任务时调用
                * @returns 一个执行体，调用它可以执行一轮任务，一轮结束后会调用 onRest 或 onEnd。
                */
            produceExecuteBody(roundNum: number, onRest: (excuteBody: Function) => void, onEnd: (self: RoundRunner) => void): () => void;
    }
}

declare module 'gnfun/Runner/AsyncRunner' {
    enum StepStatu {
            Idle = 0,
            Pending = 1,
            Stop = 2,
            Fulfilled = 3
    }
    type Step = (call: () => void) => void;
    export default class AsyncRunner {
            statu: StepStatu;
            constructor();
            /**
                * 在队列末尾添加一个步骤
                * @param step 可以是一个步骤，也可以是一个步骤数组。如果是步骤数组，那么这些步骤会并行执行，并且这些步骤全都结束后，才会执行下一个步骤。
                */
            Then(step: Step | Step[]): void;
            /**
                * 开始执行队列中的步骤
                * @param complete 所有步骤执行完毕后调用
                */
            Start(complete: () => void): void;
            /**
                * 停止执行队列中的步骤
                */
            Stop(): void;
    }
    export {};
}

declare module 'gnfun/Util' {
    function easyEncode(src: string): string;
    /**
        * 获取给定对象的类名
        * @param obj 对象
        * @return 类型名
        */
    function className(obj: any): string;
    function deepClone(data: any): any;
    /**
        * 判断给定字符串是否是空字符串
        * @param str
        */
    function emptyString(str: string): boolean;
    function remap(value: number, low1: number, high1: number, low2: number, high2: number): number;
    function objectValues(obj: Record<string, any>): Array<any>;
    function getEnumName<E>(enumType: Record<string, E>, enumVal: E): string;
    function enumValues(enumType: Object, valType: "string"): Array<string>;
    function enumValues(enumType: Object, valType: "number"): Array<number>;
    function enumKeys(enumType: Record<string, any>, valType: "string" | "number"): Array<string>;
    /**
        * check if the given v is null or undefined
        * @param v value to be checked
        */
    function isNull(v: any): boolean;
    /**
        * check if the given v is not null nor undefined
        * @param v value to be checked
        */
    function notNull(v: any): boolean;
    function removeNullKeys<T>(obj: T): Partial<T>;
    /**
        * 任何值转换为number值
        * @param v 任何值，包括undefined和null
        * @param defVal v无效（null或者undefined）的时候的默认值，不填表示NaN
        * @return number
        */
    function toNumber(v: any, defVal?: number): number | undefined;
    /**
        * 在给定范围内随机 [lowerBound, upperBound)，结果是个伪随机，受seed影响
        * @param lowerBound 随机侧1
        * @param upperBound 随机侧2
        * @return 范围随机值
        */
    function random(lowerBound: number, upperBound: number, seed?: number): number;
    function randomInt(lowerBound: number, upperBound: number, seed?: number): number;
    function randomIntArr(low_up: number[], seed?: number): number;
    function pick<T>(arr: Array<T>, seed?: number): T;
    function pickWeights(weights: number[], seed?: number): number;
    /**
        * 在给定数组中按权重随机一个元素
        * @param arys 数组
        * @param option 可选
        *   seed   伪随机种子
        *   fieldName 代表权重的字段名，不填表示数组元素本身就是作为权重的number
        * @return 随机到的数组元素索引，如果数组为空，返回-1
        */
    function pickWeightsBy(arys: any[], option?: {
            seed?: number;
            fieldName?: string;
    }): number;
    function arrayRemove<T>(arr: Array<T>, item: T): T[];
    function arrayRemoveFirst<T>(arr: Array<T>, match: (item: T) => boolean): T | null;
    function arrayFindIndexAll<T>(arr: Array<T>, match: (item: T) => boolean): number[];
    function arrayRemoveAll<T>(arr: Array<T>, match: (item: T) => boolean): T[];
    function arrayIncludes<T>(arr: Array<T>, item: T): boolean;
    export { easyEncode, deepClone, emptyString, remap, objectValues, getEnumName, enumValues, enumKeys, className, isNull, notNull, removeNullKeys, toNumber, random, randomInt, randomIntArr, pick, pickWeights, pickWeightsBy, arrayFindIndexAll, arrayIncludes, arrayRemove, arrayRemoveAll, arrayRemoveFirst, };
}

declare module 'gnfun/Collection/ILoopFunction' {
    export interface ILoopFunction<T> {
        (item: T): boolean;
    }
}

