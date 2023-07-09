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
export declare class FreeListIterator<T> implements IFreeListIterator<T> {
    private _list;
    private _next;
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
export declare class FreeList<T> {
    private _ary;
    private _it;
    private _tempIts;
    private _poolIts;
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
    private _adjustItByAdd;
    private _adjustItByRemove;
    report(): void;
}
