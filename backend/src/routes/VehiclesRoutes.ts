import { inject, injectable } from "inversify";
import { Response, Router } from "express";
import { DependencyKeys, RouteKeys } from "../utils/Constants";
import { RouteBase } from "./RouteBase";
import { IRouteProvider } from "../contracts/IRouteProvider";
import { IVehicleService } from "../contracts/IVehicleService";
@injectable()
export class VehiclesRoutes extends RouteBase implements IRouteProvider {

    constructor(
        @inject(DependencyKeys.VehicleService) public readonly vehicleService: IVehicleService,
    ) {
        super();
    }

    public configureRoutes(router: Router): void { 
        this.configureVehiclesRoutes(router); 

    }

   
    private configureVehiclesRoutes(router: Router): void {

        router.post(`/${RouteKeys.api}/${RouteKeys.Vehicles}`, async (request, response) => {
            this.safelyExecuteAsync(response, async () => {
                let vehicle = await this.vehicleService.createVehicleAsync(request.body, request["context"]);
                response.status(200).json(vehicle);
            });
        });

        router.get(`/${RouteKeys.api}/${RouteKeys.Vehicles}`, async (request, response) => {
            this.safelyExecuteAsync(response, async () => {
                
                let options: any = {
                    vehicleNo : request?.query?.vehicleNo as string ?? "",
                    pageNo : request?.query?.pageNo ?? 1,
                    pageSize : request?.query?.pageSize ?? 10
                }
                let vehicles = await this.vehicleService.getAllVehiclesAsync(options, request["context"]);
                response.status(200).json(vehicles);
            });
        });

        router.put(`/${RouteKeys.api}/${RouteKeys.Vehicles}/:vehicleId`, async (request, response) => {
            this.safelyExecuteAsync(response, async () => {
                let vehicle= await this.vehicleService.editVehicleAsync(request.params.vehicleId, request.body, request["context"]);
                response.status(200).json(vehicle);
            });
        });

        router.delete(`/${RouteKeys.api}/${RouteKeys.Vehicles}/:vehicleId`, async (request, response) => {
            this.safelyExecuteAsync(response, async () => {
                await this.vehicleService.deleteVehiclesAsync(request.params.vehicleId, request["context"]);
                response.status(200).json({
                    message: "Vehicle deleted successfully!"
                });
            });
        });

    }
}