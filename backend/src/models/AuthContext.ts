export interface APIContext<T = any, U = any> {
    tenantId: string;
    authToken: string;
    user: T;
    meta: { [key: string]: U }
    permissions: string[];
}