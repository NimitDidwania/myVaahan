import { Component, OnInit, ViewChild } from '@angular/core';
import { ClientService } from '../client.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { filter } from 'rxjs';
import { InvoiceModalComponent } from '../invoice-modal/invoice-modal.component';
import { HeaderComponent } from '../header/header.component';
declare var bootstrap: any;
@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css'],
  standalone : true,
  imports : [FormsModule, CommonModule, NgFor, NgIf, InvoiceModalComponent, HeaderComponent]
})
export class InvoicesComponent implements OnInit {
  invoiceModalDetails: any;
  filterFromDate: string | null = null;
  filterToDate: string | null = null;
  filterFromDateEpoch: number | null = null;
  filterToDateEpoch: number | null = null;
  showCalendarPopup: boolean = false;
  loading: boolean = false;
  invoices: any[] = [];
  pageDetails : any  = {
    pageNo : 1,
    pageSize : 10,
    total : -1
  };
  isLoading: boolean = false;
  filterInvoiceNo : any = null;
  modal :any;
  customers: any[] = [];
  //childs
  @ViewChild(InvoiceModalComponent) invoiceModal!: InvoiceModalComponent;

  constructor(
    private clientService: ClientService,
    private router: Router
  ) {}

  async ngOnInit() {
    // Fetch invoices from the backend service
    try{
      await this.reloadInvoicesAsync();
      await this.getCustomersAsync();
    }
    catch(err){
      console.log(err);
    }
    
  }

  async getCustomersAsync(){
    try{
      this.customers = await this.clientService.getCustomersAsync();
      console.log(this.customers);
    }
    catch(err){

    }
  }

  toggleCalendarPopup() {
    this.showCalendarPopup = !this.showCalendarPopup;
  }

  // Apply filter based on the search term
  applyFilter() {
    this.pageDetails.pageNo = 1;
    this.reloadInvoicesAsync();
  }


  

  // Get class for invoice status
  getStatusClass(status: string) {
    return {
      'text-success': status === 'valid',
      'text-warning': status === 'Pending',
      'text-danger': status === 'invalid',
    };
  }

  
  async downloadInvoice(invoice : any) {
    this.loading = true;
    await this.clientService.downloadInvoiceAsync([invoice._id]);
    this.loading = false;
  }

  sendInvoice(invoice : any) {
    this.clientService.sendMailAsync([invoice._id]);
  }

  async reloadInvoicesAsync(dateFilter: boolean = false) : Promise<any> {
    this.loading = true;
    let response = await this.clientService.getInvoices({
      invoiceNo: this.filterInvoiceNo,
      fromIssueDate: this.filterFromDateEpoch,
      tillIssueDate: this.filterToDateEpoch
    }, this.pageDetails);

    this.invoices = response.vehicles;
    this.pageDetails = {
      pageNo : response.pageInfo.pageNo,
      pageSize : response.pageInfo.pageSize,
      total : response.pageInfo.total
    }
    this.loading = false;
  }
  getTotalPages(){
    return Math.ceil(this.pageDetails.total/this.pageDetails.pageSize);
  }
  
  async changePage(pageNo : number) {
    this.pageDetails.pageNo = pageNo;
    await this.reloadInvoicesAsync();
  }

  openInvoiceModal(invoice : any = null) {

    this.invoiceModal.setInvoiceData(invoice);
    this.invoiceModal.setCustomers(this.customers);
    this.modal = new bootstrap.Modal(document.getElementById('invoiceModal'));
    this.modal.show();
  }

  async invoiceMethod(event: any)
  {
    this.modal.hide();
    switch(event.type) 
    {
      case "Create Invoice" :
        await this.createInvoice(event.invoice);
        break;
      case "Edit Invoice":

        await this.editInvoice(event.invoice);
      break;
    }
  }

  async editInvoice(invoice: any) {
    let id = invoice.id;
    delete invoice.id;
    invoice.transactionType = 0;
    invoice.total = -1*invoice.item.totalAmount;
    await this.clientService.editInvoiceAsync(id, invoice);
    this.pageDetails.pageNo = 1;
    await this.reloadInvoicesAsync();
  }

  async createInvoice(invoice : any) {
    invoice.transactionType = 0;
    invoice.total = -1*invoice.item.totalAmount;
    await this.clientService.createInvoiceAsync(invoice);
    this.pageDetails.pageNo = 1;
    await this.reloadInvoicesAsync();
  }
  
  showLedgerModal(customerId: string) {
    this.router.navigate(["/ledger", "customer", customerId]);
  }

  async downloadInvoices() {
    this.loading = true;
    let invoiceNos =
    this.invoices.map(invoice => invoice._id);
    await this.clientService.downloadInvoiceAsync(invoiceNos);
    this.loading = false;
  }

  async downloadSummary(){
    this.loading = true;
    let invoiceNos = this.invoices.map(invoice => invoice._id);
    await this.clientService.downloadSummaryAsync({
      invoiceNo: this.filterInvoiceNo,
      fromIssueDate: this.filterFromDateEpoch,
      tillIssueDate: this.filterToDateEpoch
    }, this.pageDetails);
    this.loading = false;
  }
  applyDateFilter(){
    this.toggleCalendarPopup();
    if(!(!!this.filterFromDate) || !(!!this.filterToDate))
      return;
    this.filterFromDateEpoch = this.toEpoch(this.filterFromDate);
    this.filterToDateEpoch = this.toEpoch(this.filterToDate);
    this.pageDetails.pageNo = 1;
    this.pageDetails.pageSize = 10;
    
    this.reloadInvoicesAsync(true);
  }
  clearDateFilter(){
    this.toggleCalendarPopup();
    this.filterFromDate = null;
    this.filterToDate = null;
    this.filterFromDateEpoch = null;
    this.filterToDateEpoch = null;
    this.pageDetails.pageNo = 1;
    this.pageDetails.pageSize = 10;
    
    this.reloadInvoicesAsync(true);
  }




  toEpoch(dateString: string) {
    return new Date(`${dateString}T00:00:00Z`).getTime()/1000; // Epoch in milliseconds
  }
}
