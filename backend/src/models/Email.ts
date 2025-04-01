export class Email {
    constructor(
        public readonly subject: string,
        public readonly textBody: string,
        public readonly htmlBody: string,
        public readonly to: string[],
        public readonly cc: string[] = null,
        public readonly attachments: Attachment[] = [],
        public readonly from: string = null,
        public readonly bcc: string[] = null
    ) { }
}

export class Attachment {
    constructor(

        public readonly file: Buffer,
        public readonly fileName: string,
        public readonly type: string
    ) { }
}
