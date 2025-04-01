import { IConnectionInfo, IDBConfigProvider } from "./contracts/IDBConfigProvider";
import { IDBProvider } from "./contracts/IDBProvider";
import * as mongo from 'mongodb';
import { MongoDBProvider } from "./MongoDBProvider";

export class RepositoryFactory{
    static _clientMap: Map<string, mongo.MongoClient> = new Map<string, mongo.MongoClient>()
    private connectionInfoPromise: Promise<IConnectionInfo>;
    
    constructor(dbConfigProvider: IDBConfigProvider){
        if(dbConfigProvider == null || dbConfigProvider == undefined)
            throw "dbConfigProvider is mandatory";

        this.connectionInfoPromise = dbConfigProvider.getConnectionInfoAsync();
    }

    public static async disposeAsync():Promise<void>{
        RepositoryFactory._clientMap.forEach((client)=>{
            client.close();
        });
        RepositoryFactory._clientMap.clear();
    }  
    async getMongoProviderAsync(dbName: string, collectionName: string, suppressContext: boolean = false, context: {tenantId: string} | null): Promise<IDBProvider>{
        var connectionInfo = await this.connectionInfoPromise;

        this.ensureValidConnectionInfo(connectionInfo);

        var client = await RepositoryFactory.getMongoClientAsync(connectionInfo);
        
        return new MongoDBProvider(client, dbName, collectionName, suppressContext ? null : context?.tenantId);
    }

    private ensureValidConnectionInfo(connectionInfo: IConnectionInfo){
        if(connectionInfo == null)
            throw "connection info not provided";

        if(!(!!connectionInfo.connectionString))
            throw "connection string missing in connection info";
    }

    private static async createConnectionAsync(connectionInfo: IConnectionInfo): Promise<mongo.MongoClient>{
        var options: any = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoReconnect: true,
            socketTimeoutMS: 60000,
            connectTimeoutMS: 10000
        };

        if(connectionInfo.useSSL){
            options.ssl = true;
            options.sslCA = connectionInfo.sslCAContent;
        }

        return await mongo.MongoClient.connect(
            connectionInfo.connectionString,
            options as mongo.MongoClientOptions
        );
    }

    private static async getMongoClientAsync(connectionInfo: IConnectionInfo): Promise<mongo.MongoClient>{
        if(RepositoryFactory._clientMap.has(connectionInfo.connectionString))
            return RepositoryFactory._clientMap.get(connectionInfo.connectionString);

        var client = await RepositoryFactory.createConnectionAsync(connectionInfo);

        RepositoryFactory._clientMap.set(connectionInfo.connectionString, client);

        return client;
    }
}
