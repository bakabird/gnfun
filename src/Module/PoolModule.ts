/**
 * 可以被任意组合使用的对象池。
 */
export class PoolModule<T> {
    private _pool: T[];
    /**
     * 创建一个对象池
     * @param _ctor 构造新对象时执行的方法。
     * @param _dtor 回收对象时执行的方法。
     */
    constructor(private _ctor: () => T, private _dtor?: (o: T) => void) {
        this._pool = [];
    }
    /**
     * 从对象池中取出一个对象
     * @returns 一个对象
     */
    public alloc(): T {
        if (this._pool.length > 0) {
            return this._pool.shift()!;
        } else {
            return this._ctor();
        }
    }
    /**
     * 回收一个对象
     * @param o 回收对象
     */
    public free(o: T) {
        this._dtor?.(o);
        this._pool.push(o);
    }
}
