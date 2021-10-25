import * as CryptoJS from "crypto-js";

export class Crypto {

    public static encode(decoded: string, key: string): string {
        return CryptoJS.AES.encrypt(decoded, key).toString();
    }

    public static decode(encoded: string, key: string): string {
        return CryptoJS.AES.decrypt(encoded, key).toString(CryptoJS.enc.Utf8);
    }
}