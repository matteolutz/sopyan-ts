import {Command} from "../command";
import {Message} from "discord.js";
import {Config} from "../../config/config";
import {CommandCategory} from "../commandcategory";

export class SettingsCommand extends Command {
    public async onCommand(args: Array<string>, message: Message): Promise<boolean> {
        if(args.length < 2) return false;

        const [key, value]: Array<string> = args;
        const possibleKeys: Array<string> = [
            "prefix"
        ];

        if(!possibleKeys.includes(key)) {
            message.channel.send(`Unknown key \`${key}\`!`);
        } else {
            const setState: boolean = Config.set(key, value);
            if(!setState) {
                message.channel.send(`Failed to set \`${key}]\`!`);
                return;
            }

            const saveState = Config.save()[0] !== null;
            if(!saveState) {
                message.channel.send(`Failed to save config file!`);
                return;
            }

            message.channel.send(`\`${key}\` was successfully set to \`${value}\`.`);
        }

        return true;
    }

    public getDescription(): string {
        return "Change the settings of this bot.";
    }

    public getName(): string {
        return "settings";
    }

    public getUsage(): string {
        return "settings <key> <value>";
    }

    public getCategory(): CommandCategory {
        return CommandCategory.ADMINISTRATION;
    }

}