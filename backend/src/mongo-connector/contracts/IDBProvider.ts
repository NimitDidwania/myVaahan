import { IDBEntity } from '../contracts/IDBEntity';
import { PagingInfo } from '../contracts/PagingInfo';

export interface IDBProvider{
    createAsync(entity: IDBEntity): Promise<IDBEntity>;
    bulkCreateAsync(entities: IDBEntity[]): Promise<string[]>;
    updateAsync(query: any, newEntity: IDBEntity): Promise<number>;
    bulkUpdateAsync(query : any , updates: any, options?: any) : Promise<number>;
    partialUpdateAsync(query: any, update: any) : Promise<any>;
    bulkWriteAsync(updates : {query: any, update: any, options: {upsert: boolean}}[]) : Promise<number>;
    getItemAsync(id: string): Promise<IDBEntity>;
    findAsync(query: any, pagingInfo: PagingInfo, projection: any): Promise<Array<IDBEntity>>;
    countAsync(query: any): Promise<number>;
    removeAsync(id: string): Promise<number>;
    removeManyAsync(query: any): Promise<number>;
    aggregateAsync(query: any): Promise<any>;

}
