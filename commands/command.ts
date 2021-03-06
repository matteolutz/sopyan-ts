import {Message, PermissionResolvable} from "discord.js";
import {CommandCategory} from "./commandcategory";

export abstract class Command {

    public init(): void { }
    public stop(): void { }

    public abstract onCommand(args: Array<string>, message: Message): Promise<boolean>;

    public abstract getName(): string;
    public abstract getDescription(): string;
    public abstract getUsage(): string;
    public abstract getCategory(): CommandCategory;
    public getPermissions(): Array<PermissionResolvable> {
        return new Array<PermissionResolvable>();
    }

}