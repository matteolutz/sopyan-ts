import * as path from "path";

export class FunctionCaller {

    public readonly file: string;
    public readonly vertical: number;
    public readonly horizontal: number;

    constructor(input: string) {
        const parts: string[] = input.split(":");

        this.horizontal = parseInt(parts.pop());
        this.vertical = parseInt(parts.pop());

        this.file = parts.join(":");
    }

    public getRelativePath(to: string = path.join(__dirname, "..")): string {
        return path.relative(to, this.file);
    }

}