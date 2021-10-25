"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandCategory = void 0;
class CommandCategory {
    constructor(name, description) {
        this.name = name;
        this.description = description;
    }
}
exports.CommandCategory = CommandCategory;
CommandCategory.ADMINISTRATION = new CommandCategory("Administration", "Commands for administrating the server");
CommandCategory.UTILITY = new CommandCategory("Utility", "Commands for fun");
CommandCategory.MUSIC = new CommandCategory("Music", "Commands for music");
//# sourceMappingURL=commandcategory.js.map