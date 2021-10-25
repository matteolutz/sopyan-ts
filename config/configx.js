"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
class Config {
    static init(f) {
        try {
            this.f = require(f);
            return [true, null];
        }
        catch (e) {
            return [false, e];
        }
    }
    static stop() {
        this.f = null;
    }
    static get(p, o = false) {
        if (this.f === null || !this.f.hasOwnProperty(p))
            return o;
        return this.f[p];
    }
    static set(k, v) {
        if (this.f === null)
            return false;
        this.f[k] = v;
        return true;
    }
}
exports.Config = Config;
Config.f = null;
//# sourceMappingURL=configx.js.map