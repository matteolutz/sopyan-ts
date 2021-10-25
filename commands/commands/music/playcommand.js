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
exports.PlayCommand = void 0;
const command_1 = require("../../command");
const commandcategory_1 = require("../../commandcategory");
const musicservice_1 = require("../../../services/services/musicservice");
class PlayCommand extends command_1.Command {
    onCommand(args, message) {
        return __awaiter(this, void 0, void 0, function* () {
            musicservice_1.MusicService.getInstance().execute(message, args.join(" "))
                .then((result) => {
                message.channel.send(result.message);
            });
            return true;
        });
    }
    getDescription() {
        return "Play music";
    }
    getName() {
        return "play";
    }
    getUsage() {
        return "play <Youtube URL / Video name>";
    }
    getCategory() {
        return commandcategory_1.CommandCategory.MUSIC;
    }
}
exports.PlayCommand = PlayCommand;
//# sourceMappingURL=playcommand.js.map