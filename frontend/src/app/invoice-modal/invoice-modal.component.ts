import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-invoice-modal',
  templateUrl: './invoice-modal.component.html',
  styleUrls: ['./invoice-modal.component.css'],
  standalone : true,
  imports : [FormsModule, NgIf]
})
export class InvoiceModalComponent {
  type: string =  "Create Invoice";
  @Output() invoiceCreated = new EventEmitter<any>(); 
  
  cancel: boolean = false;
  // Model to hold form data
  invoiceData : any = {
    customerId : '',
    poNo: null,
    challanNo: null,
    vehicleNo : null,
    issueDateEpoch: 0,
    item : {
      description : "Rice Husk",
      hsnCode : "1213",
      weight : 0,
      rate : 0,
      totalAmount : 0
    },
  };
  customers: any[] = [];
  constructor() {}

  setCustomers(customers: any[]){
    this.customers = customers;
  }

  setInvoiceData(invoice: any)
  {
    if(!(!!invoice))
    {
      this.resetForm();
      return;
    }
    this.invoiceData = {
      id: invoice._id,
      invoiceNo: invoice.invoiceNo,
      customerId: invoice.customerId,
      poNo: invoice.poNo,
      challanNo: invoice.challanNo,
      vehicleNo: invoice.vehicleNo,
      issueDateEpoch: this.fromEpoch(invoice.issueDateEpoch),
      item: {
        description: invoice.item.description,
        hsnCode: invoice.item.hsnCode,
        weight: invoice.item.weight,
        rate: invoice.item.rate,
        totalAmount: invoice.item.totalAmount
      },
      status: invoice.status,
      createdTimestamp: invoice.createdTimestamp
    }
    this.cancel = invoice.status == "invalid";
    this.type = "Edit Invoice";
  }

  fromEpoch(epoch: number) : any
  {
    const date = new Date(epoch * 1000); // Convert seconds to milliseconds

    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
  
    return `${year}-${month}-${day}`;
  }

  submit() {
    // Emit the invoice data to the parent component
    
    this.invoiceData.customerId = "6714f362b3b10ccb66442c34";
    this.invoiceData.issueDateEpoch = this.toEpoch(this.invoiceData.issueDateEpoch);
    this.invoiceData.item.totalAmount = this.invoiceData.item.weight*this.invoiceData.item.rate;
    this.invoiceData.status = this.cancel ? "invalid": "valid";
    this.invoiceCreated.emit({
      invoice: this.invoiceData,
      type: this.type
    });
    // Reset form after submission
    this.resetForm();
  }

  toEpoch(dateString: any) {
    return new Date(`${dateString}T00:00:00Z`).getTime()/1000; // Epoch in milliseconds
  }

  resetForm() {
    this.invoiceData = {
      customerId : '',
      poNo: null,
      challanNo: null,
      vehicleNo : null,
      issueDateEpoch: 0,
      item : {
        description : "Rice Husk",
        hsnCode : "1213",
        weight : 0,
        rate : 0,
        totalAmount : 0
      }
    };
    this.type = "Create Invoice";
    this.cancel = false;
  }
}
