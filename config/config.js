"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const fs = require("fs");
class Config {
    static init(f) {
        this.file = f;
        try {
            return this.load();
        }
        catch (e) {
            return [null, e];
        }
    }
    static stop() {
        this.file = null;
        this.json = null;
    }
    static loadDefaults(defaults) {
        try {
            if (this.json === null)
                throw "Config was not loaded. Please use load() to do that.";
            const recursiveMap = (def, json) => {
                Object.keys(def).forEach((k) => {
                    if (!json.hasOwnProperty(k) || typeof json[k] !== typeof def[k]) {
                        json[k] = def[k];
                    }
                    else if (typeof def[k] === "object") {
                        recursiveMap(def[k], json[k]);
                    }
                });
            };
            recursiveMap(defaults, this.json);
            return [true, null];
        }
        catch (e) {
            return [null, e];
        }
    }
    static load() {
        try {
            this.json = JSON.parse(fs.readFileSync(this.file).toString());
            return [true, null];
        }
        catch (e) {
            this.json = null;
            return [null, e];
        }
    }
    static save() {
        try {
            fs.writeFileSync(this.file, JSON.stringify(this.json));
            return [true, null];
        }
        catch (e) {
            return [null, e];
        }
    }
    static set(k, v) {
        if (this.file === null || this.json === null)
            return false;
        this.json[k] = v;
        return true;
    }
    static getObjectByString(o, s) {
        s = s.replace(/\[(\w+)\]/g, '.$1');
        s = s.replace(/^\./, '');
        let a = s.split('.');
        for (let i = 0, n = a.length; i < n; ++i) {
            let k = a[i];
            if (k in o) {
                o = o[k];
            }
            else {
                return [null, false];
            }
        }
        return [o, true];
    }
    static get(k, a = false) {
        if (this.json === null)
            return a;
        let v = this.getObjectByString(this.json, k);
        if (!v[1])
            return a;
        return v[0];
    }
    static getAll() {
        return this.json;
    }
}
exports.Config = Config;
Config.file = null;
Config.json = null;
//# sourceMappingURL=config.js.map