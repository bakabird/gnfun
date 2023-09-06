'use strict';

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

/**
 * 可以被任意组合使用的对象池。
 */
class PoolModule {
    /**
     * 创建一个对象池
     * @param _ctor 构造新对象时执行的方法。
     * @param _dtor 回收对象时执行的方法。
     */
    constructor(_ctor, _dtor) {
        this._ctor = _ctor;
        this._dtor = _dtor;
        this._pool = [];
    }
    /**
     * 从对象池中取出一个对象
     * @returns 一个对象
     */
    alloc() {
        if (this._pool.length > 0) {
            return this._pool.shift();
        }
        else {
            return this._ctor();
        }
    }
    /**
     * 回收一个对象
     * @param o 回收对象
     */
    free(o) {
        var _a;
        (_a = this._dtor) === null || _a === void 0 ? void 0 : _a.call(this, o);
        this._pool.push(o);
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
/**
 * 任何值转换为number值
 * @param v 任何值，包括undefined和null
 * @param defVal v无效（null或者undefined）的时候的默认值，不填表示NaN
 * @return number
 */
function toNumber(v, defVal) {
    if (isNull(v)) {
        return isNull(defVal) ? NaN : defVal;
    }
    return Number(v);
}
// [0, 1)
function _randomWithSeed(seed) {
    seed = Math.pow(seed, 2) * 0.001;
    return toNumber('0.' + Math.sin(seed).toString().slice(6)) * 0.9999;
}
/**
 * 在给定范围内随机 [lowerBound, upperBound)，结果是个伪随机，受seed影响
 * @param lowerBound 随机侧1
 * @param upperBound 随机侧2
 * @return 范围随机值
 */
function random(lowerBound, upperBound, seed) {
    return lowerBound + (seed ? _randomWithSeed(seed) : Math.random()) * (upperBound - lowerBound);
}
function randomInt(lowerBound, upperBound, seed) {
    return Math.floor(random(lowerBound, upperBound, seed));
}
function randomIntArr(low_up, seed) {
    return randomInt(low_up[0], low_up[1], seed);
}
function pick(arr, seed) {
    return arr[randomInt(0, arr.length, seed)];
}
function pickWeights(weights, seed) {
    let total_weight = 0;
    for (let weight of weights) {
        total_weight += weight;
    }
    let rand = randomInt(0, total_weight, seed);
    let acc_weight = 0;
    let rand_idx = -1;
    for (let i = 0; i < weights.length; i++) {
        let weight = weights[i];
        acc_weight += weight;
        if (rand <= acc_weight) {
            rand_idx = i;
            break;
        }
    }
    return rand_idx;
}
/**
 * 在给定数组中按权重随机一个元素
 * @param arys 数组
 * @param option 可选
 *   seed   伪随机种子
 *   fieldName 代表权重的字段名，不填表示数组元素本身就是作为权重的number
 * @return 随机到的数组元素索引，如果数组为空，返回-1
 */
function pickWeightsBy(arys, option) {
    let seed = option && option.seed;
    let fieldName = option && option.fieldName;
    if (!arys || arys.length === 0) {
        return -1;
    }
    if (isNull(fieldName)) {
        return pickWeights(arys, seed);
    }
    fieldName = fieldName;
    let total_weight = 0;
    for (let e of arys) {
        let w = e[fieldName];
        if (isNull(w)) {
            w = 1;
        }
        total_weight += w;
    }
    let rand = randomInt(0, total_weight, seed);
    let acc_weight = 0;
    let rand_idx = arys.length - 1;
    for (let i = 0; i < arys.length; i++) {
        let e = arys[i];
        acc_weight += e[fieldName];
        if (rand <= acc_weight) {
            rand_idx = i;
            break;
        }
    }
    return rand_idx;
}
function arrayRemove(arr, item) {
    var index = arr.indexOf(item);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}
function arrayRemoveFirst(arr, match) {
    for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        if (match(element)) {
            arr.splice(index, 1);
            return element;
        }
    }
    return null;
}
function arrayFindIndexAll(arr, match) {
    return arr.reduce((pre, cur, idx) => {
        if (match(cur))
            pre.push(idx);
        return pre;
    }, []);
}
function arrayRemoveAll(arr, match) {
    const thoseRemoved = [];
    arrayFindIndexAll(arr, match).reverse().forEach((index) => {
        thoseRemoved.push(arr[index]);
        arr.splice(index, 1);
    });
    return thoseRemoved;
}
function arrayIncludes(arr, item) {
    return arr.indexOf(item) > -1;
}

class Shake2DModule {
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
    constructor(magnitude, duration, speed, shaketype, RandomRange, onGetOriginal, onShake) {
        this.magnitude = magnitude;
        this.duration = duration;
        this.speed = speed;
        this.shaketype = shaketype;
        this.RandomRange = RandomRange;
        this.onGetOriginal = onGetOriginal;
        this.onShake = onShake;
        this._time = 0;
        this._ratio = 0;
        this._random1 = random(-this.RandomRange, this.RandomRange);
        this._random2 = random(-this.RandomRange, this.RandomRange);
    }
    /**
     * 0 ~ 1
     * @returns 返回当前进度
     */
    get ratio() {
        return this._ratio;
    }
    /**
     * 推进当前进度
     */
    set ratio(v) {
        const time = v * this.duration;
        if (time > this.duration)
            return;
        if (time < this._time)
            return;
        this._upt(time - this._time);
        this._time = time;
        this._ratio = v;
    }
    _upt(dt) {
        var random1 = this._random1;
        var random2 = this._random2;
        // var random2 = UnityEngine.Random.Range(-RandomRange, RandomRange);
        var original = this.onGetOriginal();
        var magnitude = this.magnitude;
        // while (elapsed < duration) {
        //     elapsed += Time.deltaTime;
        //     var percent = elapsed / duration;
        //     var ps = percent * speed;
        // }
        this._time += dt;
        var percent = this._time / this.duration;
        var ps = percent * this.speed;
        // map to [-1, 1]
        var range1;
        var range2;
        switch (this.shaketype) {
            case "smooth":
                range1 = Math.sin(random1 + ps);
                range2 = Math.cos(random2 + ps);
                break;
            case "smoothHalfCircle":
                range1 = Math.sin(random1 + ps * Math.PI);
                range2 = Math.cos(random2 + ps * Math.PI);
                break;
            case "smoothCircle":
                range1 = Math.sin(random1 + ps * Math.PI * 2);
                range2 = Math.cos(random2 + ps * Math.PI * 2);
                break;
            case "perlinNoise":
                // not implement
                range1 = Math.sin(random1 + ps);
                range2 = Math.cos(random2 + ps);
                break;
            default:
                range1 = random(-1, 1);
                range2 = random(-1, 1);
                break;
        }
        // reduce shake start from 50% duration
        if (percent < 0.5) {
            const v2 = { x: range1 * magnitude, y: range2 * magnitude };
            v2.x += original.x;
            v2.y += original.y;
            this.onShake(v2);
        }
        else {
            var magDecay = magnitude * (2 * (1 - percent));
            const v2 = { x: range1 * magDecay, y: range2 * magDecay };
            v2.x += original.x;
            v2.y += original.y;
            this.onShake(v2);
        }
    }
}

class CountdownRunner {
    /**
     * bind 了 CountdownRunner 自己的 countdown 方法。
     */
    get bindedCountdown() {
        return this.countdown.bind(this);
    }
    /**
     *
     * @param _countdown 倒数次数
     * @param _run 倒数到 0 时执行的方法
     */
    constructor(_countdown, _run) {
        this._countdown = _countdown;
        this._run = _run;
    }
    /**
     * 倒数一次，如果倒数到 0 则执行 run 方法。
     */
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
    /**
     * 添加一个任务
     * @param step
     */
    append(step) {
        this._steps.push(step);
    }
    /**
     * 反转剩余任务队列
     */
    reverse() {
        this._steps.unsafeReverse();
    }
    /**
     * 执行一轮任务
     * @param roundNum 一轮执行多少任务
     */
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
    /**
     * 执行所有任务
     */
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
     * @returns 一个执行体，调用它可以执行一轮任务，一轮结束后会调用 onRest 或 onEnd。
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

exports.CountdownRunner = CountdownRunner;
exports.FreeList = FreeList;
exports.PoolModule = PoolModule;
exports.RoundRunner = RoundRunner;
exports.Shake2DModule = Shake2DModule;
exports.arrayFindIndexAll = arrayFindIndexAll;
exports.arrayIncludes = arrayIncludes;
exports.arrayRemove = arrayRemove;
exports.arrayRemoveAll = arrayRemoveAll;
exports.arrayRemoveFirst = arrayRemoveFirst;
exports.className = className;
exports.deepClone = deepClone;
exports.easyEncode = easyEncode;
exports.emptyString = emptyString;
exports.enumKeys = enumKeys;
exports.enumValues = enumValues;
exports.getEnumName = getEnumName;
exports.isNull = isNull;
exports.notNull = notNull;
exports.objectValues = objectValues;
exports.pick = pick;
exports.pickWeights = pickWeights;
exports.pickWeightsBy = pickWeightsBy;
exports.random = random;
exports.randomInt = randomInt;
exports.randomIntArr = randomIntArr;
exports.remap = remap;
exports.removeNullKeys = removeNullKeys;
exports.toNumber = toNumber;
