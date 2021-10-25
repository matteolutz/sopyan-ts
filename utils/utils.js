"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCaller = void 0;
const functioncaller_1 = require("./functioncaller");
function getCaller(offset = 0) {
    const err = new Error();
    const caller = err.stack.split("\n")[3 + offset];
    const fileNameMatch = caller.match(/\((.*?)\)/);
    return new functioncaller_1.FunctionCaller(fileNameMatch[1]);
}
exports.getCaller = getCaller;
//# sourceMappingURL=utils.js.map