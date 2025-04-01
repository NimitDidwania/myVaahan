import { ISmtpConfigProvider } from "../contracts/ISmtpConfigProvider";
import * as config from "../misc/config/config.json";
import { ISmtpConfig } from "../models/SmtpConfig";
export class SmtpConfigProvider implements ISmtpConfigProvider {

    public async getConfigAsync(): Promise<ISmtpConfig> {
        return {
            server: config.smtp.host,
            port: config.smtp.port,
            from: config.smtp.from,
            username: config.smtp.auth.user,
            password: config.smtp.auth.pass
        }
    }

}