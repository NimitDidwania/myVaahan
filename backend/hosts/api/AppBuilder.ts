import express, { Express, Request, Router } from "express";
import { NextFunction, Response } from "express-serve-static-core";
import { NullableType } from "joi";
import jwt from 'jsonwebtoken';
import path from "path";
export class AppBuilder {

    public readonly app: Express;
    private _routes: Map<string, Router> = new Map<string, Router>();
    private skipRoutes: string[] = [];
    private enableApiContext: boolean = false;
    private publicRoutes: string[] = []; 
    private openCors: boolean = false;
    private corsHeaders: string[];
    private defaultAllowedHeaders: string[] = ["authorization", "content-type"];
    private useJsonContent: boolean = false;
    private allowedOrigins: string[] = [];
    private trustProxyEnabled: boolean = false;
    private trustProxyValue: string | string[] = [];
    private jwtPrivateKey: string;
    private adminProtectedRoutes: string[] = [];
    constructor() {
        this.app = express();
    }

    public withAdminProtectedRoutes(routes: string[]): AppBuilder {
        this.adminProtectedRoutes = routes;
        return this;
    }

    private jwtParseFunction(token: string): Promise<any> {
        return new Promise((resolve, reject) => {
            jwt.verify(token, this.jwtPrivateKey,  { algorithms: ["RS256"] } ,(err, decoded) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(decoded);
                }
            });
        });
    }
    
    public withPublicRoutes(routes: string[]): AppBuilder { 
        this.publicRoutes = routes;
        return this;
    }

    public withRoute(routeKey: string, router: Router, skipRoutes: string[] = []): AppBuilder {
        this._routes.set(routeKey, router);
        this.skipRoutes = Array.isArray(skipRoutes) ? skipRoutes : [];
        return this;
    }

    public withTrustProxy(value: string | string[]): AppBuilder {
        this.trustProxyEnabled = true;
        this.trustProxyValue = value;
        return this;
    }

    public withApiContext(jwtPrivateKey: string): AppBuilder {
        this.enableApiContext = true;
        this.jwtPrivateKey = jwtPrivateKey;
        return this;
    }

    public withAllowedOrigins(allowedOrigins: string[]): AppBuilder {
        if (allowedOrigins == null || allowedOrigins.length == 0)
            throw "origins list cannot be empty";

        this.allowedOrigins = allowedOrigins;
        return this;
    }

    public withCors(additionalHeaders: string[] | null): AppBuilder {
        this.openCors = true;
        const headers = this.defaultAllowedHeaders.slice();

        (additionalHeaders ?? []).forEach(
            header => {
                header = header.trim().toLowerCase();
                if (!headers.includes(header))
                    headers.push(header);
            }
        );

        this.corsHeaders = headers;

        return this;
    }

    public withJsonContent(): AppBuilder {
        this.useJsonContent = true;
        return this;
    }

    public build(): Express {

        if (this.openCors)
            this.app.use(this.patchCors.bind(this));

        
        this.app.use('/assets', express.static(path.join(__dirname, '../../assets')));
        if (this.useJsonContent)
            this.app.use(express.json());

        if (this.enableApiContext)
            this.app.use(this.installApiContext.bind(this));
        else
            this.app.use(this.loadDefaultContext.bind(this));

        if (this.trustProxyEnabled) {
            this.app.set('trust proxy', this.trustProxyValue);
        }

        

        this._routes.forEach((router, key) => {
            this.app.use(key, router);
        });

        return this.app;
    }

    private loadDefaultContext(req: Request, res: Response, next: NextFunction) {
      
        req["context"] = { authToken: null, user: null, tenantId: req.headers.tenantid ?? null};
        next();
    }

    private async installApiContext(req: Request, res: Response, next: NextFunction) {
        if (this.skipRoutes.includes(req.path) || req.path.endsWith('/public')) {
            return this.loadDefaultContext(req, res, next);
        }
        try {
           

            const authorization: string = req.headers.authorization;
            let authToken: string | null = null;

            if (authorization && authorization.startsWith('Bearer ')) {
            authToken = authorization.slice(7); 
            }


            if (!!authToken) {
                try {
                    const data = await this.jwtParseFunction(authToken);
                    req["context"] = { authToken, userId:data?.userId, isAdmin: data?.isAdmin ,companyId: data?.companyId};
                    next();
                } catch (error) {
                    return res.status(403).send({message:"Auth token is expired or missing"});
                }
            } else {
                return res.status(403).send({message:"Auth token is expired or missing"});
            }
        } catch (error) {
            res.status(403).send({message:"Auth token is expired or missing"});
        }
    }

    private patchCors(req: Request, res: Response, next: NextFunction) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", this.corsHeaders.length > 0 ? this.corsHeaders.join(",") : "*");
        res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, PATCH, HEAD, DELETE, OPTIONS');

        if (req.method === "OPTIONS") {
            res.header("Access-Control-Max-Age", "86400");
            res.end();
        } else {
            next();
        }
    }
}