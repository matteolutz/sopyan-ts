"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceHandler = void 0;
class ServiceHandler {
    static init(client) {
        this.client = client;
    }
    static isServiceRegistered(s) {
        return this.services.filter((el) => el.getID().compare(s.getID())).length !== 0;
    }
    static register(s) {
        if (this.client === null)
            return false;
        if (this.isServiceRegistered(s))
            return false;
        this.services.push(s);
        // Init service
        s.init(this.client);
        return true;
    }
    static unregister(s) {
        if (this.client === null)
            return false;
        if (!this.isServiceRegistered(s))
            return false;
        this.services = this.services.filter((el) => !el.getID().compare(s.getID()));
        // Stop the service
        s.stop();
        return true;
    }
    static stop() {
        this;
    }
}
exports.ServiceHandler = ServiceHandler;
ServiceHandler.services = new Array();
ServiceHandler.client = null;
//# sourceMappingURL=servicehandler.js.map