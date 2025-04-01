import { IEmailClient } from "../contracts/IEmailClient";
import { Email } from "../models/Email";
import { createTransport } from "nodemailer";
import { ISmtpConfig } from "../models/SmtpConfig";
import { ISmtpConfigProvider } from "../contracts/ISmtpConfigProvider";

export class SmtpEmailClient implements IEmailClient {
    constructor(private configProvider: ISmtpConfigProvider) {
        if (!(!!configProvider))
            throw new Error("configProvider is mandatory");
    }

    async sendAsync(email: Email): Promise<void> {
        let _config = await this.configProvider.getConfigAsync();
        let _transporter = this._getTransporterAsync(_config);

        let cc = (email.cc ?? []).join(",");
        let bcc = (email.bcc ?? []).join(",");

        await _transporter.sendMail({
            from: email.from || _config.from,
            to: email.to.join(","),
            cc: cc.length > 0 ? cc : null,
            bcc: bcc.length > 0 ? bcc : null,
            subject: email.subject,
            text: email.textBody,
            html: email.htmlBody,
            attachments: (email.attachments ?? []).map(attachment => {
                return {
                    content: attachment.file,
                    filename: attachment.fileName,
                    type: attachment.type,
                    disposition: 'attachment'  // Ensure it is sent as an attachment
                };
            })
        });
    }

    private _getTransporterAsync(config: ISmtpConfig) {
        return createTransport(
            {
                host: config.server,
                port: config.port,
                auth: { user: config.username, pass: config.password },
                connectionTimeout: 3000
            }
        );
    }
}