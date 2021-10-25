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
exports.HelloCommand = void 0;
const command_1 = require("../command");
const randomemoji_1 = require("../../utils/randomemoji");
const commandcategory_1 = require("../commandcategory");
class HelloCommand extends command_1.Command {
    onCommand(args, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const ping = Date.now() - message.createdTimestamp;
            const emojis = args.length !== 0 ? args.join(" ") : randomemoji_1.RandomEmoji.getRandomEmoji();
            message.channel.send(`Hello to you ${message.author.username}, ${emojis} (Ping: ${ping}ms)`);
            return true;
        });
    }
    getName() {
        return "hello";
    }
    getDescription() {
        return "A Hello World command that shows the ping to the bot.";
    }
    getUsage() {
        return "hello [as many emojis as you want ;)]";
    }
    getCategory() {
        return commandcategory_1.CommandCategory.UTILITY;
    }
}
exports.HelloCommand = HelloCommand;
//# sourceMappingURL=hellocommand.js.map