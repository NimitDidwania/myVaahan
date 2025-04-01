export class BadRequestException extends Error {
    constructor(msg: string) {
        super(msg);
    }
}