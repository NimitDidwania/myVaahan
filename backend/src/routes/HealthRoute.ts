import { inject, injectable } from "inversify";
import { Response, Router } from "express";
import { DependencyKeys, RouteKeys } from "../utils/Constants";
import { RouteBase } from "./RouteBase";
import { IRouteProvider } from "../contracts/IRouteProvider";
@injectable()
export class HealthRoute extends RouteBase implements IRouteProvider {

    constructor(
       
    ) {
        super();
    }

    public configureRoutes(router: Router): void { 
        router.get(`/health`, async (req, res) => {
            res.status(200).json({
                "message" : "Green"
            })
        })

    }
}