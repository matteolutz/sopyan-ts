import {EnumIdentity, getCaller} from "./utils";
import {Color} from "./color";

export class LogLevel {

    private static AllValues: { [name: string]: LogLevel } = {};

    public static readonly ERROR: LogLevel = new LogLevel(0, `ERROR`, Color.RED);
    public static readonly WARNING: LogLevel = new LogLevel(1, `WARNING`, Color.YELLOW);
    public static readonly INFO: LogLevel = new LogLevel(2, `INFO`, Color.GREEN);

    private constructor(public readonly id: number, public readonly displayValue: string, public readonly color: string) {
        LogLevel.AllValues[displayValue] = this;
    }

    public static parseEnum(data: string): LogLevel {
        return LogLevel.AllValues[data];
    }

}

export class Logger {

    private static readonly NAME: string = "Sopyan";
    private static readonly COLOR: boolean = true;

    private static level: LogLevel = LogLevel.INFO;

    //region LogLevel Getter / Setter
    public static setLogLevel(level: LogLevel): void {
        this.level = level;
    }

    public static getLogLevel(): LogLevel {
        return this.level;
    }
    //endregion

    private static log(msg: any, level: LogLevel): any {
        const caller: string = getCaller(1).getRelativePath();

        if (this.level.id >= level.id) {
            if (this.COLOR) {
                console.log(`${Color.BLUE + this.NAME} ${Color.LIGHT_BLACK}[${Color.RESET + level.color + level.displayValue + Color.LIGHT_BLACK}]${Color.RESET} ${Color.LIGHT_BLACK}[${Color.MAGENTA + caller + Color.LIGHT_BLACK}]${Color.RESET} ${Color.BLUE}-${Color.RESET}${level.color}`, msg, Color.RESET);
            } else {
                console.log(`${this.NAME} [${level.displayValue}] -`, msg);
            }
        }
    }

    public static info(msg: any): void {
        this.log(msg, LogLevel.INFO);
    }

    public static warning(msg: any): void {
        this.log(msg, LogLevel.WARNING);
    }

    public static error(err: Error | any): void {
        if (err instanceof Error) return this.log(err.message, LogLevel.ERROR)
        this.log(err, LogLevel.ERROR);
    }

}