import {Command} from "../../command";
import {Message} from "discord.js";
import {CommandCategory} from "../../commandcategory";
import {MusicService} from "../../../services/services/musicservice";

export class StopCommand extends Command {

    public async onCommand(args: string[], message: Message): Promise<boolean> {
        message.channel.send(MusicService.getInstance().stopPlayback(message).message);
        return true;
    }

    public getDescription(): string {
        return "Stop the music";
    }

    public getName(): string {
        return "stop";
    }

    public getUsage(): string {
        return "stop";
    }

    public getCategory(): CommandCategory {
        return CommandCategory.MUSIC;
    }

}