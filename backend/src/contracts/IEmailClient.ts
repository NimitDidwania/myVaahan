import { Email } from "../models/Email";

export interface IEmailClient {
    sendAsync(email: Email): Promise<void>;
}