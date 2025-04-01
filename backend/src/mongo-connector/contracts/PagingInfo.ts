export class PagingInfo {
    public limit: number;
    public skip: number;
    public sort: any;

    constructor(limit: number = 10, skip: number = 0, sort: any = null) {
        this.limit = limit > 0 ? limit : 10;
        this.skip = skip >= 0 ? skip : 0;

        if(sort != null && typeof(sort) != "object")
            throw "sort needs to be an object";
            
        this.sort = sort;
    }
}
