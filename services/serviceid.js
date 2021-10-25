"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceID = void 0;
const uuid_1 = require("uuid");
class ServiceID {
    constructor(name) {
        this.name = name;
        this.name = name;
        this.uuid = `Service-${this.name}-${uuid_1.v4()}`;
    }
    compare(o) {
        return this.uuid === o.uuid;
    }
}
exports.ServiceID = ServiceID;
//# sourceMappingURL=serviceid.js.map