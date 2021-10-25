import {Command} from "../command";
import {Message} from "discord.js";
import {RandomEmoji} from "../../utils/randomemoji";
import {CommandCategory} from "../commandcategory";

export class HelloCommand extends Command {

    public async onCommand(args: string[], message: Message): Promise<boolean> {
        const ping: number = Date.now() - message.createdTimestamp;
        const emojis: string = args.length !== 0 ? args.join(" ") : RandomEmoji.getRandomEmoji();
        message.channel.send(`Hello to you ${message.author.username}, ${emojis} (Ping: ${ping}ms)`);
        return true;
    }

    public getName(): string {
        return "hello";
    }

    public getDescription(): string {
        return "A Hello World command that shows the ping to the bot.";
    }

    public getUsage(): string {
        return "hello [as many emojis as you want ;)]";
    }

    public getCategory(): CommandCategory {
        return CommandCategory.UTILITY;
    }

}