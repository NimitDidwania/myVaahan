import { ObjectId } from "mongodb";

export interface IDBEntity {
    _id: string;
    createdTimestamp: number;
    updatedTimestamp: number;
}

export class DBEntity implements IDBEntity{
    _id: string;
   
    createdTimestamp: number;
    updatedTimestamp: number;

    public static createDefault(): IDBEntity {
        return new DBEntity();
    }

    public static toObjectId(_id: string | any): any {
        return new ObjectId(_id);
    }
}

