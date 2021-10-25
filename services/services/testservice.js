"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestService = void 0;
const service_1 = require("../service");
const logger_1 = require("../../utils/logger");
const crypto_1 = require("../../config/crypto");
class TestService extends service_1.Service {
    init(client) {
        logger_1.Logger.info("Test service started");
        const KEY = "SOMESUPERSECRETKEY";
        const decoded = "super secret information";
        const encoded = crypto_1.Crypto.encode(decoded, KEY);
        console.log(encoded);
        const reDecoded = crypto_1.Crypto.decode(encoded, KEY);
        console.log(reDecoded);
    }
}
exports.TestService = TestService;
//# sourceMappingURL=testservice.js.map