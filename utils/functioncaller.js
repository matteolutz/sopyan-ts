"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionCaller = void 0;
const path = require("path");
class FunctionCaller {
    constructor(input) {
        const parts = input.split(":");
        this.horizontal = parseInt(parts.pop());
        this.vertical = parseInt(parts.pop());
        this.file = parts.join(":");
    }
    getRelativePath(to = path.join(__dirname, "..")) {
        return path.relative(to, this.file);
    }
}
exports.FunctionCaller = FunctionCaller;
//# sourceMappingURL=functioncaller.js.map