"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusService = void 0;
const service_1 = require("../service");
const config_1 = require("../../config/config");
class DiscordStatusType {
    constructor(id) {
        this.id = id;
    }
}
DiscordStatusType.PLAYING = new DiscordStatusType("PLAYING");
DiscordStatusType.STREAMING = new DiscordStatusType("STREAMING");
DiscordStatusType.LISTENING = new DiscordStatusType("LISTENING");
DiscordStatusType.WATCHING = new DiscordStatusType("WATCHING");
DiscordStatusType.CUSTOM_STATUS = new DiscordStatusType("CUSTOM_STATUS");
DiscordStatusType.COMPETING = new DiscordStatusType("COMPETING");
class DiscordStatus {
    constructor(name, type, args = {}) {
        this.name = name;
        this.type = type;
        this.args = args;
    }
    getStatus() {
        return Object.assign({ type: this.type.id }, this.args);
    }
}
class PreparedString {
    constructor(prepared) {
        this.prepared = prepared;
        this.bindings = new Map();
        const preparedSplit = this.prepared.split(PreparedString.SEPERATOR);
        for (let i = 1; i < preparedSplit.length; i++) {
            this.bindings.set(preparedSplit[i].substring(0, 1), null);
        }
    }
    bind(k, v) {
        if (!this.bindings.has(k))
            return false;
        this.bindings.set(k, v);
        return true;
    }
    get() {
        let returnString = this.prepared;
        this.bindings.forEach((v, k) => {
            returnString = returnString.replace(`${PreparedString.SEPERATOR}${k}`, v);
        });
        return returnString;
    }
}
PreparedString.SEPERATOR = "%";
class StatusService extends service_1.Service {
    constructor() {
        super(...arguments);
        this.statuses = [
            new DiscordStatus("ein Video von Mathmada", DiscordStatusType.WATCHING, {
                url: "https://www.youtube.com/channel/UCM45Z1TwOvSLyJTPPCPn-ZA",
            }),
            new DiscordStatus("%phelp", DiscordStatusType.LISTENING),
            new DiscordStatus("auf %g Servern", DiscordStatusType.PLAYING),
            new DiscordStatus("Botwettbewerb", DiscordStatusType.COMPETING),
        ];
        this.currentIndex = 0;
    }
    init(client) {
        setInterval(() => {
            this.currentIndex = this.currentIndex === this.statuses.length - 1 ? 0 : this.currentIndex + 1;
            let statusName = this.statuses[this.currentIndex].name;
            //region Prepare String
            if (!(statusName instanceof PreparedString))
                statusName = new PreparedString(statusName);
            statusName.bind("p", config_1.Config.get("prefix", "!"));
            statusName.bind("g", client.guilds.cache.size);
            const finalStatusName = statusName.get();
            //endregion
            client.user.setActivity(finalStatusName, this.statuses[this.currentIndex].getStatus());
        }, 5000);
    }
}
exports.StatusService = StatusService;
//# sourceMappingURL=statusservice.js.map