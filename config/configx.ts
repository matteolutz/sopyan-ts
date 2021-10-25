export class Config {

    private static f: any = null;

    public static init(f: string): (any)[] {
        try {
            this.f = require(f);
            return [true, null];
        } catch(e: any) {
            return [false, e];
        }
    }

    public static stop(): void {
        this.f = null;
    }

    public static get(p: string, o: any = false): any {
        if(this.f === null || !this.f.hasOwnProperty(p)) return o;
        return this.f[p];
    }

    public static set(k: string, v: any): boolean {
        if(this.f === null) return false;
        this.f[k] = v;
        return true;
    }
}