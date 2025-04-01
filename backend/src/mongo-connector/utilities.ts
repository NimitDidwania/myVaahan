export class Utilities{
    static getTimestamp(): number {
        return Math.floor(((new Date()).getTime()) / 1000);
    }

    public static getFileExtension(fileName: string): string | null{
        if(!fileName.includes("."))
            return null;

        let portions = fileName.split(".");

        return portions[portions.length - 1];
    }

}
