import { createHash, randomBytes } from "crypto";
import { Base } from "../utils/Base";
import {  RepositoryFactory } from "../mongo-connector/RepositoryFactory";
import { IDBProvider } from "../mongo-connector/contracts/IDBProvider";
import * as config from "../misc/config/config.json";
import fs from "fs";
import path from "path";
import { compile } from "handlebars";
export abstract class ServiceBase extends Base {

    protected repositoryFactory: RepositoryFactory;

    constructor(repositoryFactoryProvider: () => RepositoryFactory) {
        super();
        if (!repositoryFactoryProvider) throw "repositoryFactoryProvider is mandatory";
        this.repositoryFactory = repositoryFactoryProvider();
    }

    protected getDbProvider<T>(collection: string, context: any =null, suppressContext: boolean = false): Promise<IDBProvider> {
        return this.repositoryFactory.getMongoProviderAsync(config.database.dbName, collection, suppressContext, context);
    }

    protected getPasswordHash(password: string, salt: string): string {
        var hash = createHash("sha512");
        hash.update(`${password}-${salt}`);
        return hash.digest("hex");
    }

    protected generateSalt(): string {
        return randomBytes(64).toString("hex");
    }

    protected async getEmailTemplateContent(templateName: string, context: any): Promise<string> {
        return new Promise((resolve, reject) => {
            const templatePath: string = path.resolve(__dirname, "..", "templates", `${templateName}.html`);
            fs.readFile(templatePath, { encoding: "utf8" }, (error: NodeJS.ErrnoException, data: string) => {
                if (error) {
                    console.error(`Error reading template file ${templateName}: ${error.message}`);
                    reject(new Error(`Failed to read email template: ${templateName}`));
                    return;
                }
                
                if (!data) {
                    console.error(`Template file ${templateName} is empty`);
                    reject(new Error(`Email template is empty: ${templateName}`));
                    return;
                }
    
                try {
                    const cleanedData = data.replace(/(\r\n|\n|\r|\t)/g, "");
                    const compiledTemplate = compile(cleanedData, { noEscape: true });
                    const renderedTemplate = compiledTemplate(context);
                    resolve(renderedTemplate);
                } catch (compileError) {
                    console.error(`Error compiling or rendering template ${templateName}: ${compileError.message}`);
                    reject(new Error(`Failed to process email template: ${templateName}`));
                }
            });
        });
    }

    protected async populateEmailTemplate(template: string, context: any): Promise<string> {
        return new Promise((resolve, reject) => {
            
                try {
                    const cleanedData = template.replace(/(\r\n|\n|\r|\t)/g, "");
                    const compiledTemplate = compile(cleanedData, { noEscape: true });
                    const renderedTemplate = compiledTemplate(context);
                    resolve(renderedTemplate);
                } catch (compileError) {
                    reject(new Error(`Failed to process email template`));
                }
            });
    }

    protected toCandidate(json: any): any{
        if(!(!!json))
            return null;

        return {
            id: (json.id ?? json._id).toString(),
            name: json.name,
            emailId: json.emailId,
            picture: this.toAsset(json.picture),
            resume: this.toAsset(json.resume),
            idc: json.idc,
            contactNumber: json.contactNumber,
            location: json.location,
            isRegistered: json.isRegistered,
            createdTimestamp: json.createdTimestamp,
            updatedTimestamp: json.updatedTimestamp,
        }
    }

    protected toJobApplication(json: any): any {
        if(!(!!json))
            return null;
        return {
            id: (json.id ?? json._id),
            candidateId: json.candidateId,
            jobId: json.jobId,
            resume: this.toAsset(json.resume),
            location: json.location,
            enrichRecommenedStatus: json.enrichRecommendedStatus,
            status: json.status,
            createdTimestamp: json.createdTimestamp,
            updatedTimestamp: json.updatedTimestamp,
            statusDescription: json.statusDescription,
            enrichScore: json.enrichScore
        }
    }

    protected toAsset(json: any): any{
        if(!(!!json))
            return null;

        return {
            fileKey: json.fileKey,
            fileName: json.fileName,
            publicUrl: json.publicUrl
        };
    }
    protected getDateString(epoch: number) {
        let istDate = new Date(new Date(epoch*1000).toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
        let day = String(istDate.getDate()).padStart(2, '0');
        let month = String(istDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        let year = istDate.getFullYear();
        let time = `${day}-${month}-${year}`;
        return time;
    }
}