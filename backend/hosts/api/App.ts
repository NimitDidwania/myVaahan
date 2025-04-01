import "reflect-metadata";
import express from "express";
import { ContainerFactory } from "./ContainerFactory";
import * as fs from "fs";
import * as path from "path";
import { AppBuilder } from "./AppBuilder";
import { IRouteProvider } from "../../src/contracts/IRouteProvider";
import { DependencyKeys } from "../../src/utils/Constants";
import * as config from "../../src/misc/config/config.json"
export class App {
    public readonly app: express.Express;

    private constructor(app: express.Express) {
        this.app = app;
    }

    public static async create(): Promise<App> {
        const container = ContainerFactory.getContainer();
        const router = express.Router();
        router.get("/", (request, response) => { response.send("APIs Started!"); });
        const routeProviders = container.getAll<IRouteProvider>(DependencyKeys.Routes);
        routeProviders.forEach(routeProvider => routeProvider.configureRoutes(router));

        const jwtPublicKey = await fs.promises.readFile(path.resolve("src/misc/keys/public.pem"), "utf8");

      

        const app = new AppBuilder()
            .withRoute("/", router,config.publicRoutes)
            .withJsonContent()
            .withApiContext(jwtPublicKey)
            .withAllowedOrigins(["localhost:4200"])
            .withCors(['offset', "correlationid", "tenantid"])
            .withAdminProtectedRoutes([])
            .build();

        return new App(app);
    }

    public static async init(): Promise<express.Express> {
        const appInstance = await App.create();
        return appInstance.app;
    }
}

export default App.init();
