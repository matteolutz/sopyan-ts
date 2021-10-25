import {Command} from "./command";
import {GuildMember, Message, MessageEmbed, PermissionResolvable} from "discord.js";

export class CommandHandler {

    private static commands: Map<string, Command> = new Map<string, Command>();
    private static helpCommand: Command = null;

    public static register(c: Command): boolean {
        if (this.commands.has(c.getName())) return false;
        this.commands.set(c.getName(), c);

        // Init the command
        c.init();

        return true;
    }

    public static unregister(c: Command): boolean {
        if (!this.commands.has(c.getName())) return false;
        this.commands.delete(c.getName());

        // Stop the command
        c.stop();

        return true;
    }

    public static stop(): void {
        this.commands.forEach((c) => c.stop());
    }

    public static isRegisteredCommand(c: string): boolean {
        return this.commands.has(c);
    }

    public static getCommand(c: string): Command {
        if(!this.commands.has(c)) return null;
        return this.commands.get(c);
    }

    public static getCommands(): Map<string, Command> {
        return this.commands;
    }

    public static getAllowedCommands(m: GuildMember): Array<Command> {
        const allowedCommands: Array<Command> = new Array<Command>();

        this.commands.forEach((c: Command) => {
            const missingPermissions: Array<PermissionResolvable> = c.getPermissions().filter((p: PermissionResolvable) => !m.hasPermission(p));
            if(missingPermissions.length === 0) {
                allowedCommands.push(c);
            }
        });

        return allowedCommands;
    }

    public static setHelpCommand(helpCommand: Command): void {
        if(this.helpCommand !== null && this.commands.has(this.helpCommand.getName())) this.commands.delete(this.helpCommand.getName());

        this.commands.set(helpCommand.getName(), helpCommand);
        this.helpCommand = helpCommand;
    }

    public static async sendHelp(message: Message, command: Command = null): Promise<void> {
        const args: any = command !== null ? [command.getName()] : new Array<any>();
        if(this.helpCommand !== null) await this.execute(this.helpCommand.getName(), args, message);
    }

    public static async execute(c: string, args: Array<string>, message: Message): Promise<void> {
        if (!this.commands.has(c)) {
            const notFoundMessage: MessageEmbed = new MessageEmbed()
                .setColor("#0099ff")
                .setTitle("The command `" + c + "` was not found!")
                .setTimestamp();
            await message.channel.send(notFoundMessage);
            return;
        }

        const cObj: Command = this.commands.get(c);

        const missingPermissions: Array<PermissionResolvable> = cObj.getPermissions().filter((p: PermissionResolvable) => !message.member.hasPermission(p));

        if (missingPermissions.length !== 0) {
            const errorMessage: MessageEmbed = new MessageEmbed()
                .setColor("#0099ff")
                .setTitle("Missing permissions for command: `" + cObj.getName() + "`")
                .setDescription("You do **not** have enough permissions to execute this command. You're lacking the following permission(s): `" + missingPermissions.join("`, `") + "`\n\u200b")
                .addField("This isn't correct?", "If this isn't correct please contact the server owner / administrator.")
                .setTimestamp();
            await message.channel.send(errorMessage);
            return;
        }

        if (!cObj.onCommand(args, message)) {
            message.channel.send(`There was an error while executing the command \`${cObj.getName()}\`. Here's some help ;)...`)
                .then(() => this.sendHelp(message, cObj));
        }
    }
}