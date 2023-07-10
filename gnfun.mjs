class FreeListIterator {
    constructor(list) {
        this._list = list;
        this._next = 0;
    }
    hasNext() { return this._next < this._list.size; }
    peekNext() { return this._list.at(this._next); }
    getNext() { return this._list.at(this._next++); }
    moveNext() { ++this._next; }
    get nextIndex() { return this._next; }
    get _nextIndex() { return this._next; }
    set _nextIndex(value) { this._next = value; }
}
/**
 * 一个自由的list，在使用遍历器遍历的过程中，可以删除任意元素
 */
class FreeList {
    constructor(ary) {
        this._ary = ary || [];
        this._it = new FreeListIterator(this);
        this._tempIts = null;
        this._poolIts = null;
    }
    /**
     * re-get the iterator of list
     */
    get it() {
        this._it._nextIndex = 0;
        return this._it;
    }
    /**
     * begin a safe visit with iterator
     * @returns iterator for visiting
     */
    beginVisit() {
        let it;
        if (!this._tempIts) {
            this._tempIts = [];
        }
        if (this._poolIts && this._poolIts.length > 0) {
            it = this._poolIts.pop();
        }
        else {
            it = new FreeListIterator(this);
        }
        it._nextIndex = 0;
        this._tempIts.push(it);
        return it;
    }
    /**
     * End a visit
     * @param iit
     */
    endVisit(iit) {
        let it = iit;
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
    get size() {
        return this._ary.length;
    }
    /**
     * elm count of list
     */
    get length() {
        return this._ary.length;
    }
    /**
     * return elm at index of i
     */
    at(i) {
        return this._ary[i];
    }
    /**
     * 返回列表的第一个元素，失败就返回空
     */
    get front() {
        return this._ary[0];
    }
    /**
     * 返回列表的最后一个元素，失败就返回空
     */
    get back() {
        return this._ary[this._ary.length - 1];
    }
    /**
     * add t at the end of list
     * @param t
     */
    push(t) {
        this._adjustItByAdd(this._ary.length, 1);
        return this._ary.push(t);
    }
    /**
     * remove the last elm
     */
    pop() {
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
    unshift(t) {
        this._adjustItByAdd(0, 1);
        return this._ary.unshift(t);
    }
    /**
     * remove elm at the front of list
     */
    shift() {
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
    indexOf(t, startIdx) {
        return this._ary.indexOf(t, startIdx);
    }
    /**
     * 查找符合条件的元素在列表中的索引，失败返回-1
     * @param condition 添加判断函数，返回true表示符合条件
     * @param startIdx 开始查找位置，可选，默认0
     * @returns （第一个）符合条件的元素在列表中的索引，没有找到返回-1
     */
    indexIf(condition, startIdx) {
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
    findFirstIf(condition) {
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
    remove(t) {
        return this.removeAt(this.indexOf(t));
    }
    /**
     * 逆转数组
     */
    unsafeReverse() {
        this._ary.reverse();
    }
    /**
     * 移除给定位置的元素
     * @param idx 待移除的元素的位置
     * @returns 移除成功返回被移除的元素，移除失败返回空
     */
    removeAt(idx) {
        if (idx >= 0 && idx < this._ary.length) {
            this._adjustItByRemove(idx, 1);
            let ret = this._ary[idx];
            this._ary.splice(idx, 1);
            return ret;
        }
        return undefined;
    }
    splice(startIdx, len) {
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
    removeFirstIf(callback, startIdx) {
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
    removeIf(callback) {
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
    insert(t, idx) {
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
    foreach_unsafe(loop, startIdx) {
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
    foreach(loop, startIdx) {
        startIdx || (startIdx = 0);
        let it = this.it;
        while (it.hasNext()) {
            if (it.nextIndex < startIdx) { //未到索引区域
                it.moveNext();
                continue;
            }
            if (loop(it.getNext()) === false) { //退出
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
    foreach_safe(loop, startIdx) {
        let ret = true;
        startIdx || (startIdx = 0);
        let it = this.beginVisit();
        while (it.hasNext()) {
            if (it.nextIndex < startIdx) { //未到索引区域
                it.moveNext();
                continue;
            }
            if (loop(it.getNext()) === false) { //退出
                ret = false;
                break;
            }
        }
        this.endVisit(it);
        return ret;
    }
    map(mapFunc) {
        let rltArr = [];
        let index = 0;
        this.foreach_unsafe((item) => {
            rltArr.push(mapFunc(item, index++));
            return true;
        });
        return rltArr;
    }
    /**
     * 清理列表
     */
    clear() {
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
    clone(from, len) {
        return this.copyTo(new FreeList(), from, len);
    }
    /**
     * 列表拷贝
     * @param dst 目标列表
     * @param from 其实元素索引，可选，默认0
     * @param len 拷贝数量，可选，不填表示从from拷贝到列表末尾
     * @returns 目标列表
     */
    copyTo(dst, from, len) {
        from = Math.max(0, from || 0);
        len !== null && len !== void 0 ? len : (len = this._ary.length);
        let endIdx = Math.min(from + len, this._ary.length);
        for (let i = from; i < endIdx; ++i) {
            dst.push(this._ary[i]);
        }
        return dst;
    }
    _adjustItByAdd(index, count) {
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
    _adjustItByRemove(index, count) {
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
    report() {
        console.log('reprot >');
        console.log(this._ary);
        console.log('reprot <');
    }
}

class PoolModule {
    constructor(_ctor, _dtor) {
        this._ctor = _ctor;
        this._dtor = _dtor;
        this._pool = [];
    }
    alloc() {
        if (this._pool.length > 0) {
            return this._pool.shift();
        }
        else {
            return this._ctor();
        }
    }
    free(o) {
        var _a;
        (_a = this._dtor) === null || _a === void 0 ? void 0 : _a.call(this, o);
        this._pool.push(o);
    }
}

class CountdownRunner {
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

class RoundRunner {
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

const easyEncodeDist = {
    "a": "l",
    "b": "k",
    "c": "j",
    "d": "i",
    "e": "h",
    "f": "g",
    "g": "f",
    "h": "e",
    "i": "d",
    "j": "c",
    "k": "b",
    "l": "a",
    "m": "t",
    "n": "s",
    "o": "r",
    "p": "q",
    "q": "p",
    "r": "o",
    "s": "n",
    "t": "m",
    "u": "z",
    "v": "y",
    "w": "x",
    "x": "w",
    "y": "v",
    "z": "u",
    "A": "L",
    "B": "K",
    "C": "J",
    "D": "I",
    "E": "H",
    "F": "G",
    "G": "F",
    "H": "E",
    "I": "D",
    "J": "C",
    "K": "B",
    "L": "A",
    "M": "T",
    "N": "S",
    "O": "R",
    "P": "Q",
    "Q": "P",
    "R": "O",
    "S": "N",
    "T": "M",
    "U": "Z",
    "V": "Y",
    "W": "X",
    "X": "W",
    "Y": "V",
    "Z": "U"
};
function easyEncode(src) {
    // use easyEncodeDist to translate
    let result = "";
    for (let i = 0; i < src.length; i++) {
        const char = src[i];
        result += easyEncodeDist[char] || char;
    }
    return result;
}
/**
 * 获取给定对象的类名
 * @param obj 对象
 * @return 类型名
 */
function className(obj) { return obj.constructor.name; }
function deepClone(data) {
    if (data !== null && data !== void 0 ? data : true) {
        return data;
    }
    var toString = Object.prototype.toString;
    var t = toString.call(data), o, i, ni;
    if (t === '[object Array]') {
        o = [];
        for (i = 0, ni = data.length; i < ni; i++) {
            o.push(deepClone(data[i]));
        }
        return o;
    }
    else if (t === '[object Object]') {
        o = {};
        for (i in data) {
            o[i] = deepClone(data[i]);
        }
        return o;
    }
    else {
        return data;
    }
}
/**
 * 判断给定字符串是否是空字符串
 * @param str
 */
function emptyString(str) {
    return !!(str !== null && str !== void 0 ? str : true) || str === '';
}
function remap(value, low1, high1, low2, high2) {
    // 将输入值从第一个范围映射到0-1之间
    const normalizedValue = (value - low1) / (high1 - low1);
    // 将0-1之间的值映射到第二个范围
    return (normalizedValue * (high2 - low2)) + low2;
}
function objectValues(obj) {
    var allowedTypes = ["[object String]", "[object Object]", "[object Array]", "[object Function]"];
    var objType = Object.prototype.toString.call(obj);
    if (obj === null || typeof obj === "undefined") {
        throw new TypeError("Cannot convert undefined or null to object");
    }
    else if (!~allowedTypes.indexOf(objType)) {
        return [];
    }
    else {
        // if ES6 is supported
        if (Object.keys) {
            return Object.keys(obj).map(function (key) {
                return obj[key];
            });
        }
        var result = [];
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                result.push(obj[prop]);
            }
        }
        return result;
    }
}
function getEnumName(enumType, enumVal) {
    return Object.keys(enumType).find(key => enumType[key] == enumVal);
}
function enumValues(enumType, valType) {
    if (valType == "string") {
        return objectValues(enumType);
    }
    else {
        return objectValues(enumType).filter(v => typeof v == "number");
    }
}
function enumKeys(enumType, valType) {
    if (valType == "string") {
        return Object.keys(enumType);
    }
    return Object.keys(enumType).filter(key => typeof enumType[key] == "number");
}
/**
 * check if the given v is null or undefined
 * @param v value to be checked
 */
function isNull(v) {
    return v === null || v === undefined;
}
/**
 * check if the given v is not null nor undefined
 * @param v value to be checked
 */
function notNull(v) { return v !== null && v !== undefined; }
function removeNullKeys(obj) {
    const newObj = {};
    for (const key in obj) {
        // @ts-ignore
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            if (notNull(value)) {
                newObj[key] = value;
            }
        }
    }
    return newObj;
}

export { CountdownRunner, FreeList, PoolModule, RoundRunner, className, deepClone, easyEncode, emptyString, enumKeys, enumValues, getEnumName, isNull, notNull, objectValues, remap, removeNullKeys };
