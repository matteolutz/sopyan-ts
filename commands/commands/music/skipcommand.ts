import {Command} from "../../command";
import {Message} from "discord.js";
import {CommandCategory} from "../../commandcategory";
import {MusicService} from "../../../services/services/musicservice";

export class SkipCommand extends Command {

    public async onCommand(args: string[], message: Message): Promise<boolean> {
        message.channel.send(MusicService.getInstance().skip(message).message);
        return true;
    }

    public getDescription(): string {
        return "Skip the current playing song";
    }

    public getName(): string {
        return "skip";
    }

    public getUsage(): string {
        return "skip";
    }

    public getCategory(): CommandCategory {
        return CommandCategory.MUSIC;
    }

}