import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ClientService } from '../client.service';
import { InvoiceModalComponent } from '../invoice-modal/invoice-modal.component';
import { LedgerModalComponent } from '../ledger-modal/ledger-modal.component';
import { NgModel } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
declare var bootstrap: any;

@Component({
  selector: 'app-ledger',
  standalone: true,
  imports: [HeaderComponent, NgFor, CommonModule, NgIf, LedgerModalComponent],
  templateUrl: './ledger.component.html',
  styleUrl: './ledger.component.css'
})
export class LedgerComponent {
  modalData: any = {
    title: "",
    type: "",
    id: ""
  }

  companyId: string = "6714f362b3b10ccb66442c34";
  ledgerEntries: any[] = [];
  pageDetails: any = {
    pageNo: 1,
    pageSize: 20,
    total: -1
  }
  modal: any;
  loading: boolean = false;

  constructor(private route: ActivatedRoute,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    // Subscribe to route parameters to get real-time updates
    this.route.paramMap.subscribe(params => {
      this.modalData.type = params.get('type'); // middle value
      this.modalData.id = params.get('id'); // customerId value
      this.modalData.title = this.modalData.type == "customer" ? "Radico Khaitan Private Limited" : localStorage.getItem("supplier-ledger");

      this.reloadLedgerData();
    });

  }



  async reloadLedgerData() {
    this.loading = true;
    let response : any  = null;
    switch(this.modalData.type)
    {
      case "customer":
        response = await this.clientService.getCustomerLedgerAsync(this.modalData.id, this.pageDetails);
      break;

      default: 
        response = await  this.clientService.getSupplierLedgerAsync(this.modalData.id, this.pageDetails);
      break;
    }

    this.ledgerEntries = response.entries;
    console.log(this.ledgerEntries);
    this.pageDetails.total = response.total;
    this.loading = false;
  }

  getTotalPages(){
    return Math.ceil(this.pageDetails.total/this.pageDetails.pageSize);
  }

  async changePage(pageNo : number) {
    console.log("ledger change page triggered");
    this.pageDetails.pageNo = pageNo;
    await this.reloadLedgerData();
  }

  openLedgerModal() {
      this.modal = new bootstrap.Modal(document.getElementById('ledgerModal'));
      this.modal.show();
  }

  async submitLedgerData(ledgerEntry: any) {
    this.modal.hide();
    this.loading = true;
    ledgerEntry.total = ledgerEntry.transactionType == "debit" ? -1*ledgerEntry.total : ledgerEntry.total;
    delete ledgerEntry.transactionType;
    
    switch(this.modalData.type)
    {
      case "customer": 
        ledgerEntry.customerId = this.modalData.id;
        await this.clientService.addCustomerTransactionAsync(ledgerEntry);
        break;
      default:
        ledgerEntry.supplier = {
          _id: this.modalData.id
        }  ;
        await this.clientService.addSupplierTransactionAsync(ledgerEntry);
        break;
    }

    this.loading = false;
    this.pageDetails.pageNo = 1;
    this.reloadLedgerData();
  }
}
