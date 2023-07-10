const easyEncodeDist: Record<string, string> = {
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
}

function easyEncode(src: string): string {
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
function className(obj: any): string { return obj.constructor.name; }

function deepClone(data: any): any {
    if (data ?? true) {
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
    } else if (t === '[object Object]') {
        o = {} as Record<any, any>;
        for (i in data) {
            o[i] = deepClone(data[i]);
        }
        return o;
    } else {
        return data;
    }
}


/**
 * 判断给定字符串是否是空字符串
 * @param str 
 */
function emptyString(str: string): boolean {
    return !!(str ?? true) || str === '';
}


function remap(value: number, low1: number, high1: number, low2: number, high2: number): number {
    // 将输入值从第一个范围映射到0-1之间
    const normalizedValue = (value - low1) / (high1 - low1);
    // 将0-1之间的值映射到第二个范围
    return (normalizedValue * (high2 - low2)) + low2;
}

function objectValues(obj: Record<string, any>): Array<any> {
    var allowedTypes = ["[object String]", "[object Object]", "[object Array]", "[object Function]"];
    var objType = Object.prototype.toString.call(obj);

    if (obj === null || typeof obj === "undefined") {
        throw new TypeError("Cannot convert undefined or null to object");
    } else if (!~allowedTypes.indexOf(objType)) {
        return [];
    } else {
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
};

function getEnumName<E>(enumType: Record<string, E>, enumVal: E): string {
    return Object.keys(enumType).find(key => enumType[key] == enumVal)!;
}

function enumValues(enumType: Object, valType: "string"): Array<string>;
function enumValues(enumType: Object, valType: "number"): Array<number>;
function enumValues(enumType: Object, valType: "string" | "number"): Array<string | number> {
    if (valType == "string") {
        return objectValues(enumType) as Array<string>;
    } else {
        return objectValues(enumType).filter(v => typeof v == "number") as Array<number>;
    }
}

function enumKeys(enumType: Record<string, any>, valType: "string" | "number"): Array<string> {
    if (valType == "string") {
        return Object.keys(enumType);
    }
    return Object.keys(enumType).filter(key => typeof enumType[key] == "number");
}

/**
 * check if the given v is null or undefined
 * @param v value to be checked
 */
function isNull(v: any): boolean {
    return v === null || v === undefined;
}

/**
 * check if the given v is not null nor undefined
 * @param v value to be checked
 */
function notNull(v: any): boolean { return v !== null && v !== undefined; }

function removeNullKeys<T>(obj: T): Partial<T> {
    const newObj = {} as Partial<T>;
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
function toNumber(v: any, defVal?: number): number | undefined {
    if (isNull(v)) {
        return isNull(defVal) ? NaN : defVal;
    }
    return Number(v);
}


// [0, 1)
function _randomWithSeed(seed: number) {
    seed = Math.pow(seed, 2) * 0.001;
    return toNumber('0.' + Math.sin(seed).toString().slice(6))! * 0.9999;
}

/**
 * 在给定范围内随机 [lowerBound, upperBound)，结果是个伪随机，受seed影响
 * @param lowerBound 随机侧1
 * @param upperBound 随机侧2
 * @return 范围随机值
 */
function random(lowerBound: number, upperBound: number, seed?: number): number {
    return lowerBound + (seed ? _randomWithSeed(seed) : Math.random()) * (upperBound - lowerBound);
}

function randomInt(lowerBound: number, upperBound: number, seed?: number): number {
    return Math.floor(random(lowerBound, upperBound, seed));
}

function randomIntArr(low_up: number[], seed?: number) {
    return randomInt(low_up[0], low_up[1], seed);
}

function pick<T>(arr: Array<T>, seed?: number): T {
    return arr[randomInt(0, arr.length, seed)];
}


function pickWeights(weights: number[], seed?: number): number {
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
function pickWeightsBy(arys: any[], option?: {
    seed?: number,
    fieldName?: string,
}): number {
    let seed = option && option.seed;
    let fieldName = option && option.fieldName;
    if (!arys || arys.length === 0) {
        return -1;
    }
    if (isNull(fieldName)) {
        return pickWeights(arys, seed);
    }
    fieldName = fieldName as string;
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

export {
    easyEncode,
    deepClone,
    emptyString,
    remap,
    objectValues,
    getEnumName,
    enumValues,
    enumKeys,
    className,

    isNull,
    notNull,
    removeNullKeys,

    toNumber,
    random,
    randomInt,
    randomIntArr,
    pick,
    pickWeights,
    pickWeightsBy,
}