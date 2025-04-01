export class ResourceConflictException extends Error{
    constructor(resourceType: string, fieldName: string, fieldValue: string){
        super(`Conflicting entries for ${resourceType} with ${fieldName} = ${fieldValue}`);
    }
}