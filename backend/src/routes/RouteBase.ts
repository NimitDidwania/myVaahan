import { Response } from "express";
import { BadRequestException } from "../exceptions/BadRequestException";
import { StatusCodes } from "http-status-codes";
import { Base } from "../utils/Base";
import { error } from "console";
import { ResourceConflictException } from "../exceptions/ResourceConflictException";
type AsyncCallback = () => Promise<void>;

export class RouteBase extends Base{
    protected async safelyExecuteAsync(resp: Response, callback: AsyncCallback) {
        try {
            await callback();
        } catch (err) {
            console.log(err);
            if (err instanceof BadRequestException)
                resp.status(StatusCodes.BAD_REQUEST).json({message:err.message})
            else if (err instanceof ResourceConflictException)
                resp.status(StatusCodes.BAD_REQUEST).json({message:err.message})
            else
                resp.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:err.message || "Something went wrong"});
        }
    }
    protected fromEpoch(epoch: number) : any
    {
        const date = new Date(epoch * 1000); // Convert seconds to milliseconds

        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();
    
        return `${day}/${month}/${year}`;
    }
}