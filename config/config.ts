import * as fs from "fs";

export class Config {

    private static file: string = null;
    private static json: any = null;

    public static init(f: string): Array<any> {
        this.file = f;
        try {
            return this.load();
        } catch (e: any) {
            return [null, e];
        }
    }

    public static stop(): void {
        this.file = null;
        this.json = null;
    }

    public static loadDefaults(defaults: any): Array<any> {
        try {
            if(this.json === null) throw "Config was not loaded. Please use load() to do that.";

            const recursiveMap = (def: any, json: any) => {
                Object.keys(def).forEach((k) => {
                    if (!json.hasOwnProperty(k) || typeof json[k] !== typeof def[k]) {
                        json[k] = def[k];
                    } else if(typeof def[k] === "object") {
                        recursiveMap(def[k], json[k]);
                    }
                });
            }
            recursiveMap(defaults, this.json);

            return [true, null];
        } catch(e: any) {
            return [null, e];
        }
    }

    public static load(): Array<any> {
        try {
            this.json = JSON.parse(fs.readFileSync(this.file).toString());
            return [true, null];
        } catch (e: any) {
            this.json = null;
            return [null, e];
        }
    }

    public static save(): Array<any> {
        try {
            fs.writeFileSync(this.file, JSON.stringify(this.json));
            return [true, null];
        } catch (e: any) {
            return [null, e];
        }
    }

    public static set(k: string, v: any): boolean {
        if (this.file === null || this.json === null) return false;
        this.json[k] = v;
        return true;
    }

    private static getObjectByString(o: any, s: string): any {
        s = s.replace(/\[(\w+)\]/g, '.$1');
        s = s.replace(/^\./, '');
        let a: Array<string> = s.split('.');
        for (let i: number = 0, n = a.length; i < n; ++i) {
            let k: string = a[i];
            if (k in o) {
                o = o[k];
            } else {
                return [null, false];
            }
        }
        return [o, true];
    }

    public static get(k: string, a: any = false): any {
        if (this.json === null) return a;
        let v = this.getObjectByString(this.json, k);
        if(!v[1]) return a;
        return v[0];
    }

    public static getAll(): any {
        return this.json;
    }

}