
export interface IVehicleService {
    createVehicleAsync(vehicle: any, context: any): Promise<any>;
    editVehicleAsync(vehicleId: string, vehicle: any, context: any): Promise<any>;
    getAllVehiclesAsync(vehicleNo: string, context: any): Promise<any>;
    deleteVehiclesAsync(id: string, context: any): Promise<any>;
}
