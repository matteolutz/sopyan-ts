import {Service} from "./service";
import {Client} from "discord.js";

export class ServiceHandler {

    private static services: Array<Service> = new Array<Service>();
    private static client: Client = null;

    public static init(client: Client): void {
        this.client = client;
    }

    public static isServiceRegistered(s: Service): boolean {
        return this.services.filter((el) => el.getID().compare(s.getID())).length !== 0;
    }

    public static register(s: Service): boolean {
        if(this.client === null) return false;
        if(this.isServiceRegistered(s)) return false;
        this.services.push(s);

        // Init service
        s.init(this.client);

        return true;
    }

    public static unregister(s: Service): boolean {
        if(this.client === null) return false;
        if(!this.isServiceRegistered(s)) return false;

        this.services = this.services.filter((el) => !el.getID().compare(s.getID()));

        // Stop the service
        s.stop();

        return true;
    }

    public static stop(): void {
        this
    }

}