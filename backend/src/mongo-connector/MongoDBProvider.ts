import { DBEntity, IDBEntity } from "./contracts/IDBEntity";
import { IDBProvider } from "./contracts/IDBProvider";
import { PagingInfo } from "./contracts/PagingInfo";
import * as mongo from "mongodb";
import { Utilities } from "./utilities";

export class MongoDBProvider implements IDBProvider {
    private dbName: string;
    private collectionName: string;
    private tenantId: string;
    private mongoClient: mongo.MongoClient;

    constructor(mongoClient: mongo.MongoClient, dbName: string, collectionName: string, tenantId: string = null) {
        if (mongoClient == null || mongoClient == undefined)
            throw "mongo client is mandatory";

        if (dbName == null || dbName == undefined || (dbName = dbName.trim()).length == 0)
            throw "dbName cannot be empty";

        if (collectionName == null || collectionName == undefined || (collectionName = collectionName.trim()).length == 0)
            throw "collectionName cannot be empty";

        this.dbName = dbName;
        this.collectionName = collectionName;
        this.tenantId = tenantId;

        this.mongoClient = mongoClient;
    }

    async createAsync(entity: IDBEntity): Promise<IDBEntity> {
        if (entity == null)
            throw "entity cannot be null";

        this.stripEmptyFields(entity);
        this.setDefaults(entity, false);

        var collection = this.getCollection();

        var created = await collection.insertOne(entity);

        entity._id = created.insertedId.toHexString();

        return entity;
    }

    async bulkCreateAsync(entities: IDBEntity[]): Promise<string[]> {
        if (entities == null || entities.length == 0)
            throw "entities cannot be empty";

        entities.forEach(entity => {
            this.stripEmptyFields(entity);
            this.setDefaults(entity, false);
        });

        var collection = this.getCollection();

        var created = await collection.insertMany(entities);

        return Object.values(created.insertedIds).map((val) => {
            return (val as any).toHexString();
        });
    }

    async updateAsync(query: any, newEntity: IDBEntity): Promise<number> {
        if (query == null || query == undefined)
            throw "query cannot be empty";

        if (newEntity == null || newEntity == undefined)
            throw "newEntity cannot be empty";

        query = this.addTenantToQuery(query);

        this.stripEmptyFields(newEntity);
        this.setDefaults(newEntity, true);

        if (newEntity._id)
            delete newEntity._id;

        var collection = this.getCollection();
        let res = await collection.replaceOne(query, newEntity);

        return res.modifiedCount;
    }

    async bulkWriteAsync(updates : {query: any, update: any, options: {upsert: boolean}}[]) : Promise<number>{
        if (updates == null || updates.length === 0)
            throw "updates cannot be empty";
    
        const collection = this.getCollection();
    
        const bulkOperations = updates.map(update => ({
            updateOne: {
                filter: this.addTenantToQuery(update.query),
                update: update.update,
                upsert: update.options.upsert || false
            }
        }));
    
        const result = await collection.bulkWrite(bulkOperations);
    
        return result.modifiedCount;
    }

    async bulkUpdateAsync(query: any, updates: any, options: any = {}): Promise<number> {
        if (updates == null || Object.keys(updates).length === 0)
            throw "updates cannot be empty";

        var collection = this.getCollection();

        var updated = await collection.updateMany(
            this.addTenantToQuery(query),
            updates,
            (options || {}) as mongo.UpdateManyOptions
        )

        return updated?.modifiedCount;
    }

    async getItemAsync(id: string): Promise<IDBEntity> {
        if (id == null )
            throw "id cannot be empty";
        
        var collection = this.getCollection();
        // console.log(await collection.findOne(this.addTenantToQuery({ _id: DBEntity.toObjectId(id) })));
        return await collection.findOne(this.addTenantToQuery({ _id: DBEntity.toObjectId(id) }));
    }

    async findAsync(query: any, pagingInfo: PagingInfo, projection: any): Promise<IDBEntity[]> {
        if (query == null || query == undefined)
            throw "query cannot be empty";

        pagingInfo = pagingInfo ?? new PagingInfo();

        query = this.addTenantToQuery(query);


        var collection = this.getCollection();

        var cursor = collection.find(query, {
            limit: pagingInfo.limit,
            skip: pagingInfo.skip,
            sort: pagingInfo.sort,
            projection: projection == null ? null : Object.assign({ _id: 1 }, projection)
        }).maxTimeMS(10000).batchSize(1000);

        try {
            return await cursor.toArray();
        } finally {
            cursor.close();
        }
    }

    countAsync(query: any): Promise<number> {
        var collection = this.getCollection();

        return collection.countDocuments(this.addTenantToQuery(query), {});
    }

    async aggregateAsync(query: any): Promise<any> {
        let response = [];
        var collection = this.getCollection();
        const aggCursor = collection.aggregate(query);
        for await (const doc of aggCursor) {
            response.push(doc);
        }
        return response;
    }

    async removeAsync(id: string): Promise<number> {
        var collection = this.getCollection();

        var resp = await collection.deleteOne(this.addTenantToQuery({ _id: DBEntity.toObjectId(id) }));

        return resp.deletedCount;
    }

    async removeManyAsync(query: any): Promise<number> {
        var collection = this.getCollection();

        var resp = await collection.deleteMany(this.addTenantToQuery(query));

        return resp.deletedCount;
    }

    async partialUpdateAsync(query: any, updatedFields: any): Promise<any> {
        if (query == null || query == undefined)
            throw "query cannot be empty";

        if (updatedFields == null || updatedFields == undefined)
            throw "newEntity cannot be empty";

        query = this.addTenantToQuery(query);

        var collection = this.getCollection();

        const update = {
            $set: updatedFields
        };

        await collection.updateOne(query, update);
    }

    private stripEmptyFields(entity: any) {
        Object.keys(entity).forEach(key => {
            if (entity[key] == null || entity[key] == undefined)
                delete entity[key];
        })
    }

    private setDefaults(entity: IDBEntity, isUpdating: boolean) {
        let timestamp = Utilities.getTimestamp();

        if (!isUpdating)
            entity.createdTimestamp = timestamp;

        entity.updatedTimestamp = timestamp;
    }

    private addTenantToQuery(query: any): any {
        if (this.tenantId == null)
            return query;

        return { $and: [query ?? {}, { tenantId: this.tenantId }] };
    }

    private getCollection(): mongo.Collection {
        return this.mongoClient.db(this.dbName).collection(this.collectionName);
    }
}
