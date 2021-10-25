"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config/config");
const logger_1 = require("./utils/logger");
const path = require("path");
const Discord = require("discord.js");
const commandhandler_1 = require("./commands/commandhandler");
const hellocommand_1 = require("./commands/commands/hellocommand");
const helpcommand_1 = require("./commands/commands/helpcommand");
const servicehandler_1 = require("./services/servicehandler");
const statusservice_1 = require("./services/services/statusservice");
const playcommand_1 = require("./commands/commands/music/playcommand");
const musicservice_1 = require("./services/services/musicservice");
const stopcommand_1 = require("./commands/commands/music/stopcommand");
const skipcommand_1 = require("./commands/commands/music/skipcommand");
const settingscommand_1 = require("./commands/commands/settingscommand");
const testservice_1 = require("./services/services/testservice");
//region Stop Sopyan
const stop = (exitCode) => {
    logger_1.Logger.info("Stopping Sopyan...");
    logger_1.Logger.info("Stopping Commands...");
    commandhandler_1.CommandHandler.stop();
    logger_1.Logger.info("Stopping Services...");
    servicehandler_1.ServiceHandler.stop();
    logger_1.Logger.info("Stopping Config...");
    config_1.Config.stop();
    if (exitCode !== 0)
        logger_1.Logger.error(`Stopped Sopyan with exit code ${exitCode}!`);
    else
        logger_1.Logger.info(`Stopped Sopyan with exit code ${exitCode}.`);
    process.exit();
};
//region Process Exit Callbacks
process.on("beforeExit", (code) => stop(code));
//endregion
//endregion
logger_1.Logger.info("Starting Sopyan...");
//region Init Config
logger_1.Logger.info("Starting Config...");
if (config_1.Config.init(path.join(__dirname, "config", "config.json"))[1] !== null) {
    logger_1.Logger.error("Failed to load config!");
    stop(1);
}
//endregion
//region Init Client
logger_1.Logger.info("Creating Client...");
const client = new Discord.Client();
//endregion
//region Client Callbacks
client.on("ready", () => {
    logger_1.Logger.info("Client start was successful. Starting other components...");
    //region Init Services
    logger_1.Logger.info("Starting Services...");
    servicehandler_1.ServiceHandler.init(client);
    servicehandler_1.ServiceHandler.register(new statusservice_1.StatusService());
    servicehandler_1.ServiceHandler.register(new musicservice_1.MusicService());
    servicehandler_1.ServiceHandler.register(new testservice_1.TestService());
    //endregion
    //region Init Commands
    logger_1.Logger.info("Starting Commands...");
    commandhandler_1.CommandHandler.register(new hellocommand_1.HelloCommand());
    commandhandler_1.CommandHandler.register(new playcommand_1.PlayCommand());
    commandhandler_1.CommandHandler.register(new stopcommand_1.StopCommand());
    commandhandler_1.CommandHandler.register(new skipcommand_1.SkipCommand());
    commandhandler_1.CommandHandler.register(new settingscommand_1.SettingsCommand());
    commandhandler_1.CommandHandler.setHelpCommand(new helpcommand_1.HelpCommand());
    //endregion
    logger_1.Logger.info("Sopyan is now ready.");
});
client.on("disconnect", () => {
    logger_1.Logger.info("Disconnect");
});
client.on("message", (message) => {
    if (message.author.bot)
        return;
    if (message.mentions.members.size !== 0 && message.mentions.members.first().id === client.user.id)
        commandhandler_1.CommandHandler.sendHelp(message);
    const prefix = config_1.Config.get("prefix", "!");
    if (message.content.startsWith(prefix)) {
        const args = message.content.split(" ");
        const cmd = args.shift().substr(prefix.length);
        commandhandler_1.CommandHandler.execute(cmd, args, message);
    }
});
//endregion
client.login(config_1.Config.get("token", null));
//# sourceMappingURL=index.js.map