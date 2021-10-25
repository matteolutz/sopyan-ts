import {Config} from "./config/config";
import {Logger} from "./utils/logger";
import * as path from "path";

import * as Discord from "discord.js";
import {CommandHandler} from "./commands/commandhandler";
import {HelloCommand} from "./commands/commands/hellocommand";
import {HelpCommand} from "./commands/commands/helpcommand";
import {ServiceHandler} from "./services/servicehandler";
import {StatusService} from "./services/services/statusservice";
import {PlayCommand} from "./commands/commands/music/playcommand";
import {MusicService} from "./services/services/musicservice";
import {StopCommand} from "./commands/commands/music/stopcommand";
import {SkipCommand} from "./commands/commands/music/skipcommand";
import {SettingsCommand} from "./commands/commands/settingscommand";
import {TestService} from "./services/services/testservice";

//region Stop Sopyan
const stop = (exitCode: number): void => {
    Logger.info("Stopping Sopyan...");

    Logger.info("Stopping Commands...");
    CommandHandler.stop();

    Logger.info("Stopping Services...");
    ServiceHandler.stop();

    Logger.info("Stopping Config...");
    Config.stop();

    if(exitCode !== 0) Logger.error(`Stopped Sopyan with exit code ${exitCode}!`);
    else Logger.info(`Stopped Sopyan with exit code ${exitCode}.`);

    process.exit();
}

//region Process Exit Callbacks
process.on("beforeExit", (code) => stop(code));
//endregion

//endregion

Logger.info("Starting Sopyan...");

//region Init Config
Logger.info("Starting Config...")
if (Config.init(path.join(__dirname, "config", "config.json"))[1] !== null) {
    Logger.error("Failed to load config!");
    stop(1);
}
//endregion

//region Init Client
Logger.info("Creating Client...");
const client: Discord.Client = new Discord.Client();
//endregion

//region Client Callbacks
client.on("ready", (): void => {

    Logger.info("Client start was successful. Starting other components...");

    //region Init Services
    Logger.info("Starting Services...");
    ServiceHandler.init(client);
    ServiceHandler.register(new StatusService());
    ServiceHandler.register(new MusicService());
    ServiceHandler.register(new TestService());
    //endregion

    //region Init Commands
    Logger.info("Starting Commands...");
    CommandHandler.register(new HelloCommand());

    CommandHandler.register(new PlayCommand());
    CommandHandler.register(new StopCommand());
    CommandHandler.register(new SkipCommand());

    CommandHandler.register(new SettingsCommand());

    CommandHandler.setHelpCommand(new HelpCommand());
    //endregion

    Logger.info("Sopyan is now ready.");
});

client.on("disconnect", (): void => {
    Logger.info("Disconnect");
});

client.on("message", (message: Discord.Message): void => {
    if (message.author.bot) return;

    if (message.mentions.members.size !== 0 && message.mentions.members.first().id === client.user.id) CommandHandler.sendHelp(message);

    const prefix: string = Config.get("prefix", "!");
    if (message.content.startsWith(prefix)) {
        const args: string[] = message.content.split(" ");
        const cmd = args.shift().substr(prefix.length);

        CommandHandler.execute(cmd, args, message);
    }
});
//endregion

client.login(Config.get("token", null));