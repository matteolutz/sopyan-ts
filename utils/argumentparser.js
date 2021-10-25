"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArgumentParser = void 0;
class ArgumentParser {
    constructor(blueprint) {
        this.blueprint = blueprint;
    }
    parse(args) {
        const result = new Map();
        if (args.length !== this.blueprint.args.length) {
            return false;
        }
        const length = args.length;
        for (let i = 0; i < length; i++) {
            const arg = this.blueprint.args[i];
            if (arg.type === "number") {
                const parsed = parseInt(args[i]);
                if (isNaN(parsed)) {
                    return false;
                }
                result.set(arg.name, parsed);
            }
            else if (arg.type === "nonnumeric") {
                const parsed = parseInt(args[i]);
                if (!isNaN(parsed)) {
                    return false;
                }
                result.set(arg.name, args[i]);
            }
            else if (arg.type === "tagging") {
                if (!args[i].startsWith("@")) {
                    return false;
                }
                const username = args[i].substring(1);
                result.set(arg.name, username);
            }
            else {
                result.set(arg.name, args[i]);
            }
        }
        return result;
    }
    static createAndParse(blueprint, args) {
        const parser = new ArgumentParser(blueprint);
        return parser.parse(args);
    }
    static findFirst(blueprints, args) {
        for (const blueprint of blueprints) {
            const result = ArgumentParser.createAndParse(blueprint, args);
            if (result) {
                return result;
            }
        }
        return false;
    }
}
exports.ArgumentParser = ArgumentParser;
//# sourceMappingURL=argumentparser.js.map