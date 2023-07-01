import { ILoopFunction } from "./ILoopFunction";

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

export class FreeListIterator<T> implements IFreeListIterator<T>
{
    private _list: FreeList<T>;
    private _next: number;

    constructor(list: FreeList<T>) {
        this._list = list;
        this._next = 0;
    }
    public hasNext(): boolean { return this._next < this._list.size; }
    public peekNext(): T | undefined { return this._list.at(this._next); }
    public getNext(): T | undefined { return this._list.at(this._next++); }
    public moveNext(): void { ++this._next; }
    public get nextIndex(): number { return this._next; }

    public get _nextIndex(): number { return this._next; }
    public set _nextIndex(value: number) { this._next = value; }
}

/**
 * 一个自由的list，在使用遍历器遍历的过程中，可以删除任意元素
 */
export class FreeList<T>
{
    private _ary: Array<T>;
    private _it: FreeListIterator<T>;
    private _tempIts: FreeListIterator<T>[];
    private _poolIts: FreeListIterator<T>[];
    constructor(ary?: Array<T>) {
        this._ary = ary || [];
        this._it = new FreeListIterator<T>(this);
        this._tempIts = null!;
        this._poolIts = null!;
    }
    /**
     * re-get the iterator of list
     */
    public get it(): IFreeListIterator<T> {
        this._it._nextIndex = 0;
        return this._it;
    }
    /**
     * begin a safe visit with iterator
     * @returns iterator for visiting
     */
    public beginVisit(): IFreeListIterator<T> {
        let it: FreeListIterator<T>;
        if (!this._tempIts) {
            this._tempIts = [];
        }
        if (this._poolIts && this._poolIts.length > 0) {
            it = this._poolIts.pop()!;
        }
        else {
            it = new FreeListIterator<T>(this);
        }
        it._nextIndex = 0;
        this._tempIts.push(it);
        return it;
    }
    /**
     * End a visit
     * @param iit 
     */
    public endVisit(iit: IFreeListIterator<T>): void {
        let it = <FreeListIterator<T>>iit;
        let idx = this._tempIts.indexOf(it);
        if (idx !== -1) {
            this._tempIts.splice(idx, 1);
            if (!this._poolIts) {
                this._poolIts = [];
            }
            this._poolIts.push(it);
        }
    }
    /**
     * elm count of list
     */
    public get size(): number {
        return this._ary.length;
    }
    /**
     * elm count of list
     */
    public get length(): number {
        return this._ary.length;
    }
    /**
     * return elm at index of i
     */
    public at(i: number): T | undefined {
        return this._ary[i];
    }
    /**
     * 返回列表的第一个元素，失败就返回空
     */
    public get front(): T | undefined {
        return this._ary[0];
    }
    /**
     * 返回列表的最后一个元素，失败就返回空
     */
    public get back(): T | undefined {
        return this._ary[this._ary.length - 1];
    }
    /**
     * add t at the end of list
     * @param t
     */
    public push(t: T): number {
        this._adjustItByAdd(this._ary.length, 1);
        return this._ary.push(t);
    }
    /**
     * remove the last elm
     */
    public pop(): T | undefined {
        if (this._ary.length > 0) {
            this._adjustItByRemove(this._ary.length - 1, 1);
            return this._ary.pop();
        }
        return undefined;
    }
    /**
     * add t at the front of list
     * @param t
     */
    public unshift(t: T): number {
        this._adjustItByAdd(0, 1);
        return this._ary.unshift(t);
    }
    /**
     * remove elm at the front of list
     */
    public shift(): T | undefined {
        if (this._ary.length > 0) {
            this._adjustItByRemove(0, 1);
            return this._ary.shift();
        }
        return undefined;
    }
    /**
     * 查找给定元素在列表中的索引，失败返回-1
     * @param t 待查找元素
     * @param startIdx 开始查找位置，可选，默认0
     * @returns 指定元素在列表中的索引，没有找到返回-1
     */
    public indexOf(t: T, startIdx?: number): number {
        return this._ary.indexOf(t, startIdx);
    }
    /**
     * 查找符合条件的元素在列表中的索引，失败返回-1
     * @param condition 添加判断函数，返回true表示符合条件
     * @param startIdx 开始查找位置，可选，默认0
     * @returns （第一个）符合条件的元素在列表中的索引，没有找到返回-1
     */
    public indexIf(condition: ILoopFunction<T>, startIdx?: number): number {
        if (!startIdx) {
            startIdx = 0;
        }
        for (let i = startIdx; i < this._ary.length; ++i) {
            if (condition(this._ary[i])) {
                return i;
            }
        }
        return -1;
    }
    /**
     * 查找第一个符合条件的元素，返回元素本身
     * @param condition 条件判断函数
     * @returns （第一个）符合条件的函数，没有找到返回空
     */
    public findFirstIf(condition: (t: T) => boolean): T | undefined {
        for (let i = 0; i < this._ary.length; ++i) {
            if (condition(this._ary[i])) {
                return this._ary[i];
            }
        }
        return undefined;
    }
    /**
     * 移除给定元素
     * @param t 待移除的元素
     * @returns 移除成功返回被移除的元素，移除失败返回空
     */
    public remove(t: T): T | undefined {
        return this.removeAt(this.indexOf(t));
    }
    /**
     * 逆转数组
     */
    public unsafeReverse() {
        this._ary.reverse();
    }
    /**
     * 移除给定位置的元素
     * @param idx 待移除的元素的位置
     * @returns 移除成功返回被移除的元素，移除失败返回空
     */
    public removeAt(idx: number): T | undefined {
        if (idx >= 0 && idx < this._ary.length) {
            this._adjustItByRemove(idx, 1);
            let ret = this._ary[idx];
            this._ary.splice(idx, 1);
            return ret;
        }
        return undefined;
    }
    public splice(startIdx: number, len: number): T[] | undefined {
        const idx = startIdx;
        if (idx >= 0 && idx < this._ary.length) {
            len = Math.min(len, this._ary.length - idx);
            this._adjustItByRemove(idx, len);
            return this._ary.splice(idx, len);
        }
        return undefined;
    }
    /**
     * 移除第一个符合条件的元素
     */
    public removeFirstIf(callback: (t: T) => boolean, startIdx?: number): T | undefined {
        if (!startIdx) {
            startIdx = 0;
        }
        for (let i = startIdx; i < this._ary.length; ++i) {
            if (callback(this._ary[i])) {
                return this.removeAt(i);
            }
        }
        return undefined;
    }
    /**
     * 移除所有符合条件的元素
     */
    public removeIf(callback: (t: T) => boolean): void {
        let array = this._ary;
        if (array.length == 0) {
            return;
        }
        let index = 0;
        let current = 0;
        for (; index < array.length; index++) {
            if (!callback(array[index])) {
                array[current++] = array[index];
            }
        }
        if (current < index) {
            this._adjustItByRemove(current, index - current);
            array.splice(current, index - current);
        }
    }
    /**
     * 插入元素
     */
    public insert(t: T, idx: number): number {
        if (idx < 0 || idx >= this._ary.length) {
            return this.push(t);
        }
        this._adjustItByAdd(idx, 1);
        this._ary.splice(idx, 0, t);
        return this._ary.length;
    }
    /**
     * 遍历元素，遍历期间不能删除元素（否则行为未知）
     * @param loop 遍历函数，返回false表示退出遍历，返回其它继续遍历
     * @param startIdx 开始遍历索引，可选，默认从0开始遍历
     * @return 是否完全遍历，返回false表示中间退出了
     */
    public foreach_unsafe(loop: ILoopFunction<T>, startIdx?: number): boolean {
        startIdx || (startIdx = 0);
        for (let i = startIdx; i < this._ary.length; ++i) {
            if (loop(this._ary[i]) === false) {
                return false;
            }
        }
        return true;
    }
    /**
     * 遍历元素，遍历期间可以任意添加删除元素
     * @param loop 遍历函数，返回false表示退出遍历
     * @param startIdx 遍历开始索引，可选，默认0
     * @return 是否完全遍历，返回false表示中间退出了
     */
    public foreach(loop: ILoopFunction<T>, startIdx?: number): boolean {
        startIdx || (startIdx = 0);
        let it = this.it;
        while (it.hasNext()) {
            if (it.nextIndex < startIdx) {//未到索引区域
                it.moveNext();
                continue;
            }
            if (loop(it.getNext()!) === false) {//退出
                return false;
            }
        }
        return true;
    }
    /**
     * 遍历元素（绝对安全版本），遍历期间可以任意添加删除元素
     * @param loop 遍历函数，返回false表示退出遍历
     * @param startIdx 遍历开始索引，可选，默认0
     * @return 是否完全遍历，返回false表示中间退出了
     */
    public foreach_safe(loop: ILoopFunction<T>, startIdx?: number): boolean {
        let ret = true;
        startIdx || (startIdx = 0);
        let it = this.beginVisit();
        while (it.hasNext()) {
            if (it.nextIndex < startIdx) {//未到索引区域
                it.moveNext();
                continue;
            }
            if (loop(it.getNext()!) === false) {//退出
                ret = false;
                break;
            }
        }
        this.endVisit(it);
        return ret;
    }
    public map<Rlt>(mapFunc: (item: T, index: number) => Rlt): Array<Rlt> {
        let rltArr: Array<Rlt> = [];
        let index = 0;
        this.foreach_unsafe((item) => {
            rltArr.push(mapFunc(item, index++));
            return true;
        })
        return rltArr;
    }
    /**
     * 清理列表
     */
    public clear(): void {
        this._it._nextIndex = 0;
        this._ary.length = 0;

        if (this._tempIts) {
            for (let i = 0; i < this._tempIts.length; ++i) {
                let it = this._tempIts[i];
                it._nextIndex = 0;
            }
        }
    }
    /**
     * 列表克隆
     * @param from 待克隆的起始元素索引，可选，默认0
     * @param len 克隆数量，可选，不填表示从from拷贝到列表末尾
     * @returns 克隆列表
     */
    public clone(from?: number, len?: number): FreeList<T> {
        return this.copyTo(new FreeList<T>(), from, len);
    }
    /**
     * 列表拷贝
     * @param dst 目标列表
     * @param from 其实元素索引，可选，默认0
     * @param len 拷贝数量，可选，不填表示从from拷贝到列表末尾
     * @returns 目标列表
     */
    public copyTo(dst: FreeList<T>, from?: number, len?: number): FreeList<T> {
        from = Math.max(0, from || 0);
        len ??= this._ary.length
        let endIdx = Math.min(from + len, this._ary.length);
        for (let i = from; i < endIdx; ++i) {
            dst.push(this._ary[i]);
        }
        return dst;
    }

    private _adjustItByAdd(index: number, count: number): void {
        if (this._it._nextIndex > index) {
            this._it._nextIndex += count;
        }
        if (this._tempIts) {
            for (let i = 0; i < this._tempIts.length; ++i) {
                let it = this._tempIts[i];
                if (it._nextIndex > index) {
                    it._nextIndex += count;
                }
            }
        }
    }
    private _adjustItByRemove(index: number, count: number): void {
        if (this._it._nextIndex > index) {
            let endIdx = index + count;
            this._it._nextIndex = Math.max(endIdx, this._it._nextIndex) - count;
        }
        if (this._tempIts) {
            for (let i = 0; i < this._tempIts.length; ++i) {
                let it = this._tempIts[i];
                if (it._nextIndex > index) {
                    it._nextIndex = Math.max(index + count, it._nextIndex) - count;
                }
            }
        }
    }
    public report() {
        console.log('reprot >')
        console.log(this._ary);
        console.log('reprot <')
    }
}
