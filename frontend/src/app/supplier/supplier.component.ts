import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { ClientService } from '../client.service';
import { SupplierModalComponent } from '../supplier-modal/supplier-modal.component';
import { SupplyModalComponent } from '../supply-modal/supply-modal.component';
import { Router } from '@angular/router';
import { LedgerModalComponent } from '../ledger-modal/ledger-modal.component';
declare var bootstrap: any;

@Component({
  selector: 'app-supplier',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, SupplierModalComponent, SupplyModalComponent, LedgerModalComponent],
  templateUrl: './supplier.component.html',
  styleUrl: './supplier.component.css'
})
export class SupplierComponent implements OnInit{
  modal: any = {};
  paySupply: any = null;
  filterToDate: string = "";
  filterFromDate: string = "";
  loading: boolean = false;
  showCalendarPopup: boolean = false;

  pageDetails: any =  {
    total: 0,
    pageNo: 1,
    pageSize: 10
  }

  supplies : any[] = [];
  filterSupplierName: string = '';
  searchQuery = '';
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  //childs
  @ViewChild(SupplyModalComponent) supplyModal!: SupplyModalComponent;
  @ViewChild(LedgerModalComponent) ledgerModal!: LedgerModalComponent;


  
  constructor 
  (
    private clientService: ClientService,
    private router: Router
  ) { }

  async ngOnInit() {
    // Fetch invoices from the backend service
    try{
      await this.reloadSuppliesAsync();
    }
    catch(err){
      console.log(err);
    }
    
  }

  async reloadSuppliesAsync()
  {
    this.loading = true;
    let suppliesData : any = await this.clientService.getSuppliesAsync(this.pageDetails);
    this.supplies = suppliesData.supplies;
    this.pageDetails = {
      total: suppliesData.total,
      pageNo: suppliesData.pageNo,
      pageSize: suppliesData.pageSize
    };
    this.loading = false;
  }

  onSearch() {
    // this.currentPage = 1;
    // this.updatePagination();
  }

  
  // nextPage() {
  //   if (this.currentPage < this.totalPages) {
  //     this.currentPage++;
  //     this.updatePagination();
  //   }
  // }

  // previousPage() {
  //   if (this.currentPage > 1) {
  //     this.currentPage--;
  //     this.updatePagination();
  //   }
  // }

  applyDateFilter(){

  }

  openInvoiceModal(){}

  getTotalPages(){ 
    return this.pageDetails.total / this.pageDetails.pageSize;
  }

  changePage(pageNo: number){
    this.pageDetails.pageNo = pageNo;
    this.reloadSuppliesAsync();
  }

  sendInvoice(invoice: any){}

  downloadInvoice(invoice: any) {}
  downloadSuppliers(){}
  downloadSummary(){}
  clearDateFilter(){}
  toggleCalendarPopup(){}
  applyFilter(){}
  openSupplierModal(){
    this.modal = new bootstrap.Modal(document.getElementById('supplierModal'));
    this.modal.show();
  }

  async openSupplyModal(){
    this.loading = true;
    let suppliers = await this.clientService.getSuppliersAsync();
    this.supplyModal.setSuppliers(suppliers as any[]);
    this.loading = false;

    this.modal = new bootstrap.Modal(document.getElementById('supplyModal'));
    this.modal.show();
  }
  
  async addSupplier(supplier: any){
    this.modal.hide();
    this.modal = {};
    this.loading = true;
    await this.clientService.addSupplierAsync(supplier);
    this.loading = false;
  }

  async addSupply(supply: any){
    this.modal.hide();
    this.modal = {};
    this.loading = true;
    supply.transactionType = 1;
    await this.clientService.addSupplyAsync(supply);
    await this.reloadSuppliesAsync();

    this.loading = false;
  }

  getWAText(supply: any) : string {
    
    let pichlaHisaab = (supply?.balance) ?  `%0Aपिछला हिसाब: ${encodeURIComponent(Math.ceil(supply.balance - supply.total))} ` : "";
    let totalBalance = Math.ceil(supply.balance - (supply.paid ?? 0));
    let suffix = totalBalance < 0 ? "लेना है" : "देना है";
    let kulHisaab = (supply?.balance) ?  `%0Aकुल हिसाब: ${encodeURIComponent(Math.abs(totalBalance))} ${suffix}` : "";

    let message =  `*श्री श्याम जी ट्रेडर्स* %0A%0Aदिनांक: ${encodeURIComponent(this.fromEpoch(supply.date))} 
                    %0Aनाम: ${encodeURIComponent(supply.supplier.name)} 
                    %0Aवाहन: ${encodeURIComponent(supply.vehicle)} 
                    %0Aवज़न: ${encodeURIComponent(supply.weight)} 
                    %0Aरेट: ${supply.rate} 
                    %0Aटोटल(इस वाहन का): ${encodeURIComponent(Math.ceil(supply.total + supply.cash))} 
                    %0Aनकद: ${encodeURIComponent(supply.cash ?? 0)}
                    ${pichlaHisaab}
                    %0Aपैसा लगा: ${encodeURIComponent(Math.ceil(Math.abs(supply.paid ?? 0)))} 
                    ${kulHisaab}`;
    return message;
  }

  fromEpoch(epoch: number) : any
  {
    const date = new Date(epoch * 1000); // Convert seconds to milliseconds

    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
  
    return `${day}-${month}-${year}`;
  }

  async fetchBalance(supply: any)
  {
    if(supply.balance)
    { 
      supply.balance = null;
      return;
    }
    this.loading = true;
    let balanceData : any = await this.clientService.getSupplierBalanceAsync(supply.supplier._id.toString(), supply.createdTimestamp);
    supply.balance = balanceData.balance;
    this.loading = false;
  }

  async navigateToLedger(supply: any)
  {
    localStorage.setItem("supplier-ledger", supply.supplier.name);
    this.router.navigate(["/ledger", "supplier", supply.supplier._id]);
  }

  pay(supply: any)
  {
    supply.paid = 100;
  }

  openLedgerModal(supply: any) {
    this.paySupply = supply;
    this.ledgerModal.initialize();
    this.modal = new bootstrap.Modal(document.getElementById('ledgerModal'));
    this.modal.show();
  }
  async addLedger(body: any) 
  {
    this.modal.hide();
    console.log("add ledger triggered");
    this.loading = true;
    body.supplyId = this.paySupply._id;
    body.supplierId = this.paySupply.supplier._id;
    body.total = body.transactionType == "debit" ? -1*body.total : body.total;
    delete body.transactionType;
    await this.clientService.addSupplierPaymentAsync(body);
    this.reloadSuppliesAsync();
    this.loading = false;
  }
  
}
