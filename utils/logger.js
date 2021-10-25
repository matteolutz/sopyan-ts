"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.LogLevel = void 0;
const utils_1 = require("./utils");
const color_1 = require("./color");
class LogLevel {
    constructor(id, displayValue, color) {
        this.id = id;
        this.displayValue = displayValue;
        this.color = color;
        LogLevel.AllValues[displayValue] = this;
    }
    static parseEnum(data) {
        return LogLevel.AllValues[data];
    }
}
exports.LogLevel = LogLevel;
LogLevel.AllValues = {};
LogLevel.ERROR = new LogLevel(0, `ERROR`, color_1.Color.RED);
LogLevel.WARNING = new LogLevel(1, `WARNING`, color_1.Color.YELLOW);
LogLevel.INFO = new LogLevel(2, `INFO`, color_1.Color.GREEN);
class Logger {
    //region LogLevel Getter / Setter
    static setLogLevel(level) {
        this.level = level;
    }
    static getLogLevel() {
        return this.level;
    }
    //endregion
    static log(msg, level) {
        const caller = utils_1.getCaller(1).getRelativePath();
        if (this.level.id >= level.id) {
            if (this.COLOR) {
                console.log(`${color_1.Color.BLUE + this.NAME} ${color_1.Color.LIGHT_BLACK}[${color_1.Color.RESET + level.color + level.displayValue + color_1.Color.LIGHT_BLACK}]${color_1.Color.RESET} ${color_1.Color.LIGHT_BLACK}[${color_1.Color.MAGENTA + caller + color_1.Color.LIGHT_BLACK}]${color_1.Color.RESET} ${color_1.Color.BLUE}-${color_1.Color.RESET}${level.color}`, msg, color_1.Color.RESET);
            }
            else {
                console.log(`${this.NAME} [${level.displayValue}] -`, msg);
            }
        }
    }
    static info(msg) {
        this.log(msg, LogLevel.INFO);
    }
    static warning(msg) {
        this.log(msg, LogLevel.WARNING);
    }
    static error(err) {
        if (err instanceof Error)
            return this.log(err.message, LogLevel.ERROR);
        this.log(err, LogLevel.ERROR);
    }
}
exports.Logger = Logger;
Logger.NAME = "Sopyan";
Logger.COLOR = true;
Logger.level = LogLevel.INFO;
//# sourceMappingURL=logger.js.map