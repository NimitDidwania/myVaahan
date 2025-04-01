import { InvoiceStatus } from "./InvoiceStaus";

export class BillInvoice {
    id? : string;
    customerId : string;
    poNo : string;
    invoiceNo : string;
    challanNo : string;
    vehicleNo : string;
    issueDate: string;
    status : InvoiceStatus;
    item : {
        description : string;
        hsnCode : string;
        weight : number;
        rate : number;
        totalAmount : number;
        totalAmountInWords : string;
    }
    createdTimestamp? : number;
    updatedTimestamp? : number;
}