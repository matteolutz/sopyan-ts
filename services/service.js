"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const serviceid_1 = require("./serviceid");
class Service {
    constructor() {
        this.serviceId = new serviceid_1.ServiceID(this.constructor.name);
    }
    /*private eventHandlers: Map<string, Array<Function>> = new Map<string, Array<Function>>();

    protected on(e: string, c: Function): void {
        if(this.eventHandlers.get(e) !== null) {
            this.eventHandlers.get(e).push(c);
        } else {
            this.eventHandlers.set(e, [c]);
        }
    }*/
    init(client) { }
    ;
    stop() { }
    ;
    getID() {
        return this.serviceId;
    }
}
exports.Service = Service;
//# sourceMappingURL=service.js.map