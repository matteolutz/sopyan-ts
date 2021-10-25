"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crypto = void 0;
const CryptoJS = require("crypto-js");
class Crypto {
    static encode(decoded, key) {
        return CryptoJS.AES.encrypt(decoded, key).toString();
    }
    static decode(encoded, key) {
        return CryptoJS.AES.decrypt(encoded, key).toString(CryptoJS.enc.Utf8);
    }
}
exports.Crypto = Crypto;
//# sourceMappingURL=crypto.js.map