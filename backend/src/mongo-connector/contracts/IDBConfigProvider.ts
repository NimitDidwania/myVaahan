export interface IDBConfigProvider{
    getConnectionInfoAsync(): Promise<IConnectionInfo>;
}

export interface IConnectionInfo {
    connectionString: string;
    useSSL: boolean;
    sslCAContent: string;
}
