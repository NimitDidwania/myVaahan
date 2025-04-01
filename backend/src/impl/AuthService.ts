import { inject, injectable } from "inversify";
import { IDBProvider } from "../mongo-connector/contracts/IDBProvider";
import { PagingInfo } from "../mongo-connector/contracts/PagingInfo";
import { RepositoryFactory } from "../mongo-connector/RepositoryFactory";
import { BadRequestException } from "../exceptions/BadRequestException";
import { ServiceBase } from "./ServiceBase";
import { IAuthService } from "../contracts/IAuthService";
import { CollectionNames, DependencyKeys, ResourceTypes } from "../utils/Constants";
import * as config from "../misc/config/config.json";
import { IEmailClient } from "../contracts/IEmailClient";
import { User } from "../models/User"
import { DBEntity } from "../mongo-connector/contracts/IDBEntity";

@injectable()
export class AuthService extends ServiceBase implements IAuthService {

    constructor(
        @inject(DependencyKeys.RepositoryFactory) repositoryFactoryProvider: () => RepositoryFactory,
        @inject(DependencyKeys.EmailClient) readonly emailClient: IEmailClient
    ) {
        super(repositoryFactoryProvider);
    }
    
    public async loginAsync(emailId: string, password: string, context: any): Promise<{accessToken: string, refreshToken: string, user: User}> {
        if (!emailId || !password) {
            throw new Error("Email and password are mandatory");
        }
        
        const userDbProvider: IDBProvider = await this.getDbProvider(CollectionNames.Users, context);
       

        let dbUsers: any[] = await userDbProvider.findAsync(
            { emailId },
            new PagingInfo(1, 0),
            null
        );

        if(!(!!dbUsers) || dbUsers.length == 0)
            throw new BadRequestException("Incorrect credentials");
        var dbUser = dbUsers[0];
        const pwhash: string = this.getPasswordHash(password, dbUser.auth.pwSalt);
        if (pwhash !== dbUser.auth.pwHash) {
            throw new Error("Incorrect password");
        }
    
        return this.getTokenResponse(dbUser);
    }

    private async getTokenResponse(user: any){
        const accessToken = await this.generateTokenAsync({
            userId: user._id,
            email: user.emailId,
            admin : user.admin,
            tokenType: 'access'
        }, config.jwt.access_token_expiry_time);
    
        const refreshToken = await this.generateTokenAsync({
            userId: user._id,
            email: user.emailId,
            tokenType: 'refresh'
        }, config.jwt.refresh_token_expiry_time);
        const { auth, ...userWithoutAuth } = user;
        return {
            user: User.toUser(userWithoutAuth),
            accessToken,
            refreshToken
        };
    }
    

    public async validateTokenAsync(token: string): Promise<string> {
        const payload = await this.parseTokenAsync(token);
        if (payload.tokenType !== 'access') {
            throw new BadRequestException('Invalid token type');
        }
        return payload;
    }
    
    public async refreshAccessTokenAsync(refreshToken: string): Promise<string> {
        const payload = await this.parseTokenAsync(refreshToken);
        if (payload.tokenType !== 'refresh') {
            throw new BadRequestException('Invalid token type');
        }
    
        const accessToken = await this.generateTokenAsync({
            userId: payload.userId,
            email: payload.email,
            tokenType: 'access'
        }, config.jwt.access_token_expiry_time); 
    
        return accessToken;
    }

    public async createAccountAsync(creds: any, context: any){
        let emailId: string = creds.emailId, password: string = creds.password;
        // This validation to be moved to validation middleware
        // if (!emailId || !password) {
        //     throw new Error("Email, password are mandatory");
        // }
        
        const userDbProvider: IDBProvider = await this.getDbProvider(CollectionNames.Users, context);
       

        let dbUsers: any[] = await userDbProvider.findAsync(
            { emailId },
            new PagingInfo(1, 0),
            null
        );
        console.log(dbUsers);
        if(dbUsers != null && dbUsers.length > 0){
            throw new BadRequestException("User already exists");
        }
        let auth = this.generatePasswordHash(creds.password);
        delete creds.password;
        creds.auth = auth;
        let response = await userDbProvider.createAsync(creds);
        return this.getTokenResponse(response);
    }


    public async setPasswordAsync(token: string, newPassword: string): Promise<void> {
        const payload = await this.parseTokenAsync(token);
        const emailId = payload.emailId;

        
        await this.updateUserPassword(emailId, newPassword);
        
    }
    
   
    
    private async updateUserPassword(emailId: string, newPassword: string): Promise<void> {
        if (!emailId) {
            throw new BadRequestException('Invalid token');
        }

        const userDbProvider: IDBProvider = await this.getDbProvider(CollectionNames.Users);
    
        const user = await userDbProvider.findAsync({ emailId }, new PagingInfo(1, 0), null);
    
        if (!user || user.length === 0) {
            throw new BadRequestException('Invalid token or user not found');
        }
    
        const userObject = User.toUser(user[0]);

        if(userObject.auth){
            throw new BadRequestException('Token expired');
        }
        const { pwSalt, pwHash } = this.generatePasswordHash(newPassword);
    
        const updatedUserObject = {
            ...userObject,
            auth: { pwSalt, pwHash },
        };
        await userDbProvider.updateAsync({ _id: DBEntity.toObjectId(userObject.id) }, updatedUserObject as any);
    }
    
    // Helper method to generate password hash and salt
    private generatePasswordHash(password: string): { pwSalt: string, pwHash: string } {
        const pwSalt: string = this.generateSalt();
        const pwHash: string = this.getPasswordHash(password, pwSalt);
        return { pwSalt, pwHash };
    }
    
    
}