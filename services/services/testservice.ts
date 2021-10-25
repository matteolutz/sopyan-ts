import {Service} from "../service";
import {Client} from "discord.js";
import {Logger} from "../../utils/logger";
import {Crypto} from "../../config/crypto";

export class TestService extends Service {

    init(client: Client) {
        Logger.info("Test service started");

        const KEY: string = "SOMESUPERSECRETKEY";
        const decoded: string = "super secret information";

        const encoded: string = Crypto.encode(decoded, KEY);

        console.log(encoded);

        const reDecoded: string = Crypto.decode(encoded, KEY);

        console.log(reDecoded);
    }

}