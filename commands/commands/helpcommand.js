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
exports.HelpCommand = void 0;
const command_1 = require("../command");
const discord_js_1 = require("discord.js");
const commandhandler_1 = require("../commandhandler");
const config_1 = require("../../config/config");
const commandcategory_1 = require("../commandcategory");
class HelpCommand extends command_1.Command {
    onCommand(args, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const helpMessage = new discord_js_1.MessageEmbed()
                .setColor("#0099ff");
            if (args.length > 0) {
                if (!commandhandler_1.CommandHandler.isRegisteredCommand(args[0])) {
                    message.channel.send("Command `" + args[0] + "` not found!");
                    return true;
                }
                else {
                    const c = commandhandler_1.CommandHandler.getCommand(args[0]);
                    helpMessage
                        .setTitle("Help for command `" + c.getName() + "`")
                        .addFields({ name: "Name", value: "`" + c.getName() + "`\n\u200b" }, { name: "Description", value: "`" + c.getDescription() + "`\n\u200b" }, { name: "Usage", value: "`" + config_1.Config.get("prefix", "!") + c.getUsage() + "`\n\u200b" }, { name: "Required permissions", value: (c.getPermissions().length === 0 ? "No special permissions needed." : "`" + c.getPermissions().join("`, `") + "`") + "\n\u200b" }, { name: "Category", value: c.getCategory().name })
                        .setTimestamp();
                }
            }
            else {
                helpMessage
                    .setTitle("Help")
                    .setDescription("Hier kommt dann noch hilfe dies das ananas 🍍")
                    .setTimestamp();
            }
            message.channel.send(helpMessage);
            return true;
        });
    }
    getName() {
        return "help";
    }
    getDescription() {
        return "A Help command";
    }
    getUsage() {
        return "help [command]";
    }
    getCategory() {
        return commandcategory_1.CommandCategory.ADMINISTRATION;
    }
}
exports.HelpCommand = HelpCommand;
//# sourceMappingURL=helpcommand.js.map