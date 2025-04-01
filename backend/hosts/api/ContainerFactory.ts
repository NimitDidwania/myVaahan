import { Container, interfaces } from "inversify";
import "reflect-metadata";
import { IDBConfigProvider } from "../../src/mongo-connector/contracts/IDBConfigProvider";
import { DependencyKeys } from "../../src/utils/Constants";
import { DBConfigProvider } from "../../src/mongo-connector/DBConfigProvider";
import { IEmailClient } from "../../src/contracts/IEmailClient";
import { SmtpEmailClient } from "../../src/impl/SmtpEmailClient";
import { RepositoryFactory } from "../../src/mongo-connector/RepositoryFactory";
import { IRouteProvider } from "../../src/contracts/IRouteProvider";
import { SmtpConfigProvider } from "../../src/impl/SmtpConfigProvider";
import { AuthRoutes } from "../../src/routes/AuthRoute";
import { HealthRoute } from "../../src/routes/HealthRoute";
import { IAuthService } from "../../src/contracts/IAuthService";
import { AuthService } from "../../src/impl/AuthService";
import { VehiclesRoutes } from "../../src/routes/VehiclesRoutes";
import { IVehicleService } from "../../src/contracts/IVehicleService";
import { VehicleService } from "../../src/impl/VehicleService";




export class ContainerFactory {

    public static getContainer(): Container {
        const container = new Container({ skipBaseClassChecks: true });
        
        ContainerFactory.configureServices(container);
        
        return container;
    }

    private static async configureServices(container: Container) {
        
        container.bind<IDBConfigProvider>(DependencyKeys.DbConfigProvider).to(DBConfigProvider).inSingletonScope();
        container.bind<IEmailClient>(DependencyKeys.EmailClient).toConstantValue(new SmtpEmailClient(new SmtpConfigProvider()));
        container.bind<IAuthService>(DependencyKeys.AuthService).to(AuthService);
        container.bind<IVehicleService>(DependencyKeys.VehicleService).to(VehicleService);
        container.bind(DependencyKeys.RepositoryFactory).toFactory((context: interfaces.Context) => {
            return () => {
                var dbConfigProvider = context.container.get<IDBConfigProvider>(DependencyKeys.DbConfigProvider);
                return new RepositoryFactory(dbConfigProvider);
            };
        });
        
        // Route Providers -
        container.bind<IRouteProvider>(DependencyKeys.Routes).to(VehiclesRoutes);
        container.bind<IRouteProvider>(DependencyKeys.Routes).to(AuthRoutes);
        container.bind<IRouteProvider>(DependencyKeys.Routes).to(HealthRoute);
    }
}
