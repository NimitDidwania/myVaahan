import { inject, injectable } from "inversify";
import { RepositoryFactory } from "../mongo-connector/RepositoryFactory";
import { ServiceBase } from "./ServiceBase";
import { CollectionNames, DependencyKeys, ResourceTypes } from "../utils/Constants";
import { IEmailClient } from "../contracts/IEmailClient";
import { IVehicleService } from "../contracts/IVehicleService";
import { PagingInfo } from "../mongo-connector/contracts/PagingInfo";
import { DBEntity } from "../mongo-connector/contracts/IDBEntity";

@injectable()
export class VehicleService extends ServiceBase implements IVehicleService {

    constructor(
        @inject(DependencyKeys.RepositoryFactory) repositoryFactoryProvider: () => RepositoryFactory,
        @inject(DependencyKeys.EmailClient) readonly emailClient: IEmailClient
    ) {
        super(repositoryFactoryProvider);
    }
    async createVehicleAsync(vehicle: any, context: any): Promise<any> {
        let db = await this.getDbProvider(CollectionNames.Vehicles, context);

        let vehicles : any[] = await db.findAsync({vehicleNo: vehicle.vehcileNo}, new PagingInfo(1,0), null);

        if(vehicles?.length > 0)
            throw new Error("Vehicle with same VehicleNo already exists");

        return await db.createAsync(vehicle);
    }
    async editVehicleAsync(vehicleId: string, vehicle: any, context: any): Promise<any> {
        let db = await this.getDbProvider(CollectionNames.Vehicles, context);
        let existing = await db.getItemAsync(vehicleId);
        if(!(!!existing))
            throw new Error("Vehicle with given vehicleNo does not exist");
        
        console.log(existing);
        console.log(vehicle);

        let updated = {...existing, ...vehicle};
        console.log(updated);
        return await db.updateAsync({_id: DBEntity.toObjectId(vehicleId)}, updated);
    }
    async getAllVehiclesAsync(options: any, context: any): Promise<any> {
        let db = await this.getDbProvider(CollectionNames.Vehicles, context);
        let query = (!!options?.vehicleNo) ? {vehicleNo: { "$regex": `^${options.vehicleNo}`, "$options": "i" } } : {};
        
        const[ vehicles, total] : [any[], number] = await Promise.all([
            db.findAsync(query, new PagingInfo(options.pageNo, (options.pageNo-1)*options.pageSize), null) ?? [],
            db.countAsync(query)
        ]); 
        return {
            vehicles,
            pageInfo: {
                total,
                pageNo: options.pageNo,
                pageSize: options.pageSize
            }
        };
    }
    async deleteVehiclesAsync(id: string, context: any): Promise<any> {
        let db = await this.getDbProvider(CollectionNames.Vehicles, context);
        await db.removeAsync(id);
    }
    
}