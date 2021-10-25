import {Client} from "discord.js";
import {ServiceID} from "./serviceid";

export abstract class Service {

    private serviceId: ServiceID = new ServiceID(this.constructor.name);
    /*private eventHandlers: Map<string, Array<Function>> = new Map<string, Array<Function>>();

    protected on(e: string, c: Function): void {
        if(this.eventHandlers.get(e) !== null) {
            this.eventHandlers.get(e).push(c);
        } else {
            this.eventHandlers.set(e, [c]);
        }
    }*/

    public init(client: Client): void { };
    public stop(): void { };

    public getID(): ServiceID {
        return this.serviceId;
    }

}