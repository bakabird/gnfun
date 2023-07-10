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
}