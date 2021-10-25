import {Command} from "../command";
import {Message, MessageEmbed} from "discord.js";
import {CommandHandler} from "../commandhandler";
import {Config} from "../../config/config";
import {CommandCategory} from "../commandcategory";

export class HelpCommand extends Command {

    async onCommand(args: string[], message: Message): Promise<boolean> {
        const helpMessage: MessageEmbed = new MessageEmbed()
            .setColor("#0099ff");

        if(args.length > 0) {
            if(!CommandHandler.isRegisteredCommand(args[0])) {
                message.channel.send("Command `" + args[0] + "` not found!");
                return true;
            } else {
                const c = CommandHandler.getCommand(args[0]);

                helpMessage
                    .setTitle("Help for command `" + c.getName() + "`")
                    .addFields(
                        { name: "Name", value: "`" + c.getName() + "`\n\u200b" },
                        { name: "Description", value: "`" + c.getDescription() + "`\n\u200b" },
                        { name: "Usage", value: "`" + Config.get("prefix", "!") + c.getUsage() + "`\n\u200b" },
                        { name: "Required permissions", value: (c.getPermissions().length === 0 ? "No special permissions needed." : "`" + c.getPermissions().join("`, `") + "`") + "\n\u200b" },
                        { name: "Category", value: c.getCategory().name }
                    )
                    .setTimestamp();
            }
        } else {
            helpMessage
                .setTitle("Help")
                .setDescription("Hier kommt dann noch hilfe dies das ananas 🍍")
                .setTimestamp();
        }

        message.channel.send(helpMessage);

        return true;
    }

    public getName(): string {
        return "help";
    }

    public getDescription(): string {
        return "A Help command";
    }

    public getUsage(): string {
        return "help [command]";
    }

    public getCategory(): CommandCategory {
        return CommandCategory.ADMINISTRATION;
    }t

}