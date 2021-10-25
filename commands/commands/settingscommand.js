"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsCommand = void 0;
const command_1 = require("../command");
const config_1 = require("../../config/config");
const commandcategory_1 = require("../commandcategory");
class SettingsCommand extends command_1.Command {
    onCommand(args, message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (args.length < 2)
                return false;
            const [key, value] = args;
            const possibleKeys = [
                "prefix"
            ];
            if (!possibleKeys.includes(key)) {
                message.channel.send(`Unknown key \`${key}\`!`);
            }
            else {
                const setState = config_1.Config.set(key, value);
                if (!setState) {
                    message.channel.send(`Failed to set \`${key}]\`!`);
                    return;
                }
                const saveState = config_1.Config.save()[0] !== null;
                if (!saveState) {
                    message.channel.send(`Failed to save config file!`);
                    return;
                }
                message.channel.send(`\`${key}\` was successfully set to \`${value}\`.`);
            }
            return true;
        });
    }
    getDescription() {
        return "Change the settings of this bot.";
    }
    getName() {
        return "settings";
    }
    getUsage() {
        return "settings <key> <value>";
    }
    getCategory() {
        return commandcategory_1.CommandCategory.ADMINISTRATION;
    }
}
exports.SettingsCommand = SettingsCommand;
//# sourceMappingURL=settingscommand.js.map