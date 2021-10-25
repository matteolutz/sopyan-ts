import {Command} from "../../command";
import {Message} from "discord.js";
import {CommandCategory} from "../../commandcategory";
import {MusicCommandStatus, MusicService} from "../../../services/services/musicservice";


export class PlayCommand extends Command {

    public async onCommand(args: Array<string>, message: Message): Promise<boolean> {
        MusicService.getInstance().execute(message, args.join(" "))
            .then((result: MusicCommandStatus) => {
                message.channel.send(result.message);
            });
        return true;
    }

    public getDescription(): string {
        return "Play music";
    }

    public getName(): string {
        return "play";
    }

    public getUsage(): string {
        return "play <Youtube URL / Video name>";
    }

    public getCategory(): CommandCategory {
        return CommandCategory.MUSIC;
    }

}