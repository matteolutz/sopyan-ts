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
exports.CommandHandler = void 0;
const discord_js_1 = require("discord.js");
class CommandHandler {
    static register(c) {
        if (this.commands.has(c.getName()))
            return false;
        this.commands.set(c.getName(), c);
        // Init the command
        c.init();
        return true;
    }
    static unregister(c) {
        if (!this.commands.has(c.getName()))
            return false;
        this.commands.delete(c.getName());
        // Stop the command
        c.stop();
        return true;
    }
    static stop() {
        this.commands.forEach((c) => c.stop());
    }
    static isRegisteredCommand(c) {
        return this.commands.has(c);
    }
    static getCommand(c) {
        if (!this.commands.has(c))
            return null;
        return this.commands.get(c);
    }
    static getCommands() {
        return this.commands;
    }
    static getAllowedCommands(m) {
        const allowedCommands = new Array();
        this.commands.forEach((c) => {
            const missingPermissions = c.getPermissions().filter((p) => !m.hasPermission(p));
            if (missingPermissions.length === 0) {
                allowedCommands.push(c);
            }
        });
        return allowedCommands;
    }
    static setHelpCommand(helpCommand) {
        if (this.helpCommand !== null && this.commands.has(this.helpCommand.getName()))
            this.commands.delete(this.helpCommand.getName());
        this.commands.set(helpCommand.getName(), helpCommand);
        this.helpCommand = helpCommand;
    }
    static sendHelp(message, command = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = command !== null ? [command.getName()] : new Array();
            if (this.helpCommand !== null)
                yield this.execute(this.helpCommand.getName(), args, message);
        });
    }
    static execute(c, args, message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.commands.has(c)) {
                const notFoundMessage = new discord_js_1.MessageEmbed()
                    .setColor("#0099ff")
                    .setTitle("The command `" + c + "` was not found!")
                    .setTimestamp();
                yield message.channel.send(notFoundMessage);
                return;
            }
            const cObj = this.commands.get(c);
            const missingPermissions = cObj.getPermissions().filter((p) => !message.member.hasPermission(p));
            if (missingPermissions.length !== 0) {
                const errorMessage = new discord_js_1.MessageEmbed()
                    .setColor("#0099ff")
                    .setTitle("Missing permissions for command: `" + cObj.getName() + "`")
                    .setDescription("You do **not** have enough permissions to execute this command. You're lacking the following permission(s): `" + missingPermissions.join("`, `") + "`\n\u200b")
                    .addField("This isn't correct?", "If this isn't correct please contact the server owner / administrator.")
                    .setTimestamp();
                yield message.channel.send(errorMessage);
                return;
            }
            if (!cObj.onCommand(args, message)) {
                message.channel.send(`There was an error while executing the command \`${cObj.getName()}\`. Here's some help ;)...`)
                    .then(() => this.sendHelp(message, cObj));
            }
        });
    }
}
exports.CommandHandler = CommandHandler;
CommandHandler.commands = new Map();
CommandHandler.helpCommand = null;
//# sourceMappingURL=commandhandler.js.map