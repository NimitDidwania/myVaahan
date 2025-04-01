import { readFileSync } from "fs";
import { resolve } from "path";
import jwt from "jsonwebtoken";
import moment from "moment";
import * as config from "../misc/config/config.json";
import { BadRequestException } from "../exceptions/BadRequestException";

let private_key = readFileSync(resolve(config.jwt.private_key)).toString("utf-8");
let public_key = readFileSync(resolve(config.jwt.public_key)).toString("utf-8");

export abstract class Base {

    protected async generateTokenAsync(payload: any, expiryTime?: number): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                const token = jwt.sign(
                    { ...payload, iat: moment().unix(), exp: moment().add(expiryTime || config.jwt.access_token_expiry_time, "seconds").unix() },
                    {
                        key:private_key,
                        passphrase: config.jwt.paraphrase
                    },
                    { algorithm: "RS256" });
                resolve(token);
            } catch (error) {
                reject(error);
            }
        })
    }

    protected async parseTokenAsync(token: any): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                jwt.verify(token, public_key, { complete: true, algorithms: ["RS256"] }, (error, decoded) => {
                    if (!!error) 
                        throw new BadRequestException(error.message);
                    else if (!decoded)
                        throw new BadRequestException("No auth token found");
                    resolve(decoded.payload);
                });
            } catch (error) {
                reject(error);
            }
        })
    }
}