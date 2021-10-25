import {Service} from "../service";
import {Client} from "discord.js";
import {Config} from "../../config/config";

class DiscordStatusType {
    public static readonly PLAYING: DiscordStatusType = new DiscordStatusType("PLAYING");
    public static readonly STREAMING: DiscordStatusType = new DiscordStatusType("STREAMING");
    public static readonly LISTENING: DiscordStatusType = new DiscordStatusType("LISTENING");
    public static readonly WATCHING: DiscordStatusType = new DiscordStatusType("WATCHING");
    public static readonly CUSTOM_STATUS: DiscordStatusType = new DiscordStatusType("CUSTOM_STATUS");
    public static readonly COMPETING: DiscordStatusType = new DiscordStatusType("COMPETING");

    private constructor(public readonly id: string) { }
}
class DiscordStatus {

    constructor(public readonly name: string | PreparedString, public readonly type: DiscordStatusType, public readonly args: any = {}) { }

    public getStatus(): any {
        return {
            type: this.type.id,
            ...this.args
        };
    }

}

class PreparedString {

    private static readonly SEPERATOR = "%";
    private readonly bindings: Map<string, any> = new Map<string, any>();

    constructor(private readonly prepared: string) {
        const preparedSplit: Array<string> = this.prepared.split(PreparedString.SEPERATOR);
        for(let i: number = 1; i < preparedSplit.length; i++) {
            this.bindings.set(preparedSplit[i].substring(0, 1), null);
        }
    }

    public bind(k: string, v: any): boolean {
        if(!this.bindings.has(k)) return false;
        this.bindings.set(k, v);
        return true;
    }

    public get(): string {
        let returnString = this.prepared;
        this.bindings.forEach((v: any, k: string) => {
            returnString = returnString.replace(`${PreparedString.SEPERATOR}${k}`, v);
        });
        return returnString;
    }

}

export class StatusService extends Service {

    private readonly statuses: Array<DiscordStatus> = [
        new DiscordStatus("ein Video von Mathmada", DiscordStatusType.WATCHING, {
            url: "https://www.youtube.com/channel/UCM45Z1TwOvSLyJTPPCPn-ZA",
        }),
        new DiscordStatus("%phelp", DiscordStatusType.LISTENING),
        new DiscordStatus("auf %g Servern", DiscordStatusType.PLAYING),
        new DiscordStatus("Botwettbewerb", DiscordStatusType.COMPETING),
    ];

    private currentIndex: number = 0;

    init(client: Client) {

        setInterval((): void => {
            this.currentIndex = this.currentIndex === this.statuses.length - 1 ? 0 : this.currentIndex + 1;

            let statusName: string | PreparedString = this.statuses[this.currentIndex].name;

            //region Prepare String
            if(!(statusName instanceof PreparedString)) statusName = new PreparedString(statusName);
            statusName.bind("p", Config.get("prefix", "!"));
            statusName.bind("g", client.guilds.cache.size);
            const finalStatusName: string = statusName.get();
            //endregion

            client.user.setActivity(finalStatusName, this.statuses[this.currentIndex].getStatus());
        }, 5000);
    }

}