import { ISmtpConfig } from "../models/SmtpConfig";

export interface ISmtpConfigProvider{
    getConfigAsync(): Promise<ISmtpConfig>;
}