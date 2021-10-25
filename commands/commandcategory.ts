export class CommandCategory {

    public static readonly ADMINISTRATION: CommandCategory = new CommandCategory("Administration", "Commands for administrating the server");
    public static readonly UTILITY: CommandCategory = new CommandCategory("Utility", "Commands for fun");
    public static readonly MUSIC: CommandCategory = new CommandCategory("Music", "Commands for music");

    private constructor(public readonly name, public readonly description) { }
}