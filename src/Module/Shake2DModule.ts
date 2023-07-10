import { random } from "../Util";

type Vec2 = {
    x: number,
    y: number
}
export default class Shake2DModule {
    private _random1: number;
    private _random2: number;
    private _ratio: number;
    private _time: number;

    constructor(
        private magnitude: number,
        private duration: number,
        private speed: number,
        private shaketype: "smooth" | "smoothCircle" | "smoothHalfCircle"
            | "perlinNoise" | "random",
        private RandomRange: number,
        private onGetOriginal: () => Vec2,
        private onShake: (v2: Vec2) => void) {
        this._time = 0;
        this._ratio = 0;
        this._random1 = random(-this.RandomRange, this.RandomRange);
        this._random2 = random(-this.RandomRange, this.RandomRange);
    }

    public get ratio(): number {
        return this._ratio;
    }

    public set ratio(v: number) {
        const time = v * this.duration;
        if (time > this.duration) return;
        if (time < this._time) return
        this._upt(time - this._time);
        this._time = time;
        this._ratio = v;
    }

    private _upt(dt: number) {
        var random1 = this._random1
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
                range1 = random(-1, 1)
                range2 = random(-1, 1)
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