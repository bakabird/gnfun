export class PoolModule<T> {
    private _pool: T[];
    constructor(private _ctor: () => T, private _dtor?: (o: T) => void) {
        this._pool = [];
    }
    public alloc(): T {
        if (this._pool.length > 0) {
            return this._pool.shift()!;
        } else {
            return this._ctor();
        }
    }
    public free(o: T) {
        this._dtor?.(o);
        this._pool.push(o);
    }
}
