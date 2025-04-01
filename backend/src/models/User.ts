export class User {
    constructor(
        public id: string | null,
        public emailId: string,
        public firstName: string,
        public lastName: string,
        public auth? : any,
        public createdTimestamp?: number,
        public updatedTimestamp?: number,
    ) {}

    public static toUser(json: any): User {
        if (!json) {
            return null;
        }

        return {
            id: (json.id ?? json._id).toString(),
            emailId:json.emailId,
            firstName: json.firstName,
            lastName: json.lastName,
            auth: json.auth,
            createdTimestamp: json.createdTimestamp,
            updatedTimestamp: json.updatedTimestamp,
        }
    }
}