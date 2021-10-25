import {FunctionCaller} from "./functioncaller";

export interface EnumIdentity { }

export function getCaller(offset: number = 0): FunctionCaller {
    const err: Error = new Error();

    const caller: string = err.stack.split("\n")[3 + offset];
    const fileNameMatch: RegExpMatchArray = caller.match(/\((.*?)\)/);

    return new FunctionCaller(fileNameMatch[1]);
}