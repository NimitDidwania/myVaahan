export class Customer {
    id? : string;
    name: string;
    gstin: string;

    public static fromJson (json: any) {
        return {
            id: json._id.toString(),
            name: json.name,
            gstin: json.gstin
        }
    }
}