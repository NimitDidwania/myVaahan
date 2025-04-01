import { TransactionType } from "./TransactionType";

export class Ledger {
    id? : string;
    customerId : string;
    transactionType : TransactionType; // credit => "-"; debit => "+";
    amount : number;
    balance : number;
    comment : string;
    createdTimestamp? : number;
    updatedTimestamp? : number;
}