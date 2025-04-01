export class ResourceNotFoundException extends Error{
    constructor(resourceType: string, fields: any){
        let params = Object.keys(fields).map(key => {
            return `${key}: ${fields[key]}`
        });

        super(`Missing ${resourceType} with ${params.join(", ")}`);
    }
}