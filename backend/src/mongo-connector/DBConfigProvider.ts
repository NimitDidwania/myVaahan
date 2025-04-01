import { IDBConfigProvider } from "./contracts/IDBConfigProvider";
import { IConnectionInfo } from "./contracts/IDBConfigProvider";
import { injectable } from "inversify";
import * as config from "../misc/config/config.json";
import * as fs from "fs";
import * as path from "path";

@injectable()
export class DBConfigProvider implements IDBConfigProvider {
    
    getConnectionInfoAsync(): Promise<IConnectionInfo> {
        return Promise.resolve({
            connectionString: config.database.connectionString,
            sslCAContent: !!config.database.useSSL ? this.readSslCAContent(config.database.sslCAFileName) : null,
            useSSL: config.database.useSSL
        });
    }

    private readSslCAContent(fileName: string): string {
        return fs.readFileSync(
            path.join(__dirname, "../config/" + fileName),
            "utf8"
        );
    }
}