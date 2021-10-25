import { v4 as uuidv4 } from "uuid";

export class ServiceID {

    public uuid: string;

    constructor(private readonly name: string) {
        this.name = name;
        this.uuid = `Service-${this.name}-${uuidv4()}`;
    }

    compare(o: ServiceID): boolean {
        return this.uuid === o.uuid;
    }

}