export type ArgumentType = "number" | "nonnumeric" | "tagging" | "string";

export interface IArgument {
    name: string,
    type: ArgumentType
}

export interface IArgumentParserBlueprint {
    args: IArgument[]
}

export class ArgumentParser {

    constructor(public readonly blueprint: IArgumentParserBlueprint) {}

    public parse(args: string[]): Map<string, any> | false {
        const result: Map<string, any> = new Map<string, any>();

        if(args.length !== this.blueprint.args.length) {
            return false;
        }

        const length: number = args.length;

        for(let i: number = 0; i < length; i++) {
            const arg: IArgument = this.blueprint.args[i];

            if(arg.type === "number") {
                const parsed: number = parseInt(args[i]);

                if(isNaN(parsed)) {
                    return false;
                }

                result.set(arg.name, parsed);
            } else if(arg.type === "nonnumeric") {
                const parsed: number = parseInt(args[i]);

                if(!isNaN(parsed)) {
                    return false;
                }

                result.set(arg.name, args[i]);
            } else if(arg.type === "tagging") {
                if(!args[i].startsWith("@")) {
                    return false;
                }

                const username: string = args[i].substring(1);

                result.set(arg.name, username);
            } else {
                result.set(arg.name, args[i]);
            }
        }

        return result;
    }

    public static createAndParse(blueprint: IArgumentParserBlueprint, args: string[]): Map<string, any> | false {
        const parser: ArgumentParser = new ArgumentParser(blueprint);
        return parser.parse(args);
    }

    public static findFirst(blueprints: IArgumentParserBlueprint[], args: string[]): Map<string, any> | false {
        for(const blueprint of blueprints) {
            const result: Map<string, any> | false = ArgumentParser.createAndParse(blueprint, args);
            if(result) {
                return result;
            }
        }
        return false;
    }

}