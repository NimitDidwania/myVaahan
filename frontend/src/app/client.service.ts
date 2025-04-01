import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { last, lastValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  // private apiUrl = 'https://billmanagementd.onrender.com'; 
  private apiUrl = 'http://localhost:8004'; 

  constructor(private http: HttpClient) {}

  async getCustomersAsync(): Promise<any> {
    let headers = this.getHeaders();
    return await lastValueFrom(this.http.get(`${this.apiUrl}/customers`, { headers }));
  }

  async login(emailId: string, password: string): Promise<any> {
    const body = { emailId, password };
    return await lastValueFrom(this.http.post(`${this.apiUrl}/auth/login`, body, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    }));
  }

  async getInvoices(filters : any, pageDetails : any): Promise<any> {
    // let queryParams =  !(!!filters?.invoiceNo) ? "" : `&invoiceNo=${filters.invoiceNo}`;
    // queryParams = (!(!!filters.fromIssueDate) ||  !(!!filters.tillIssueDate)) ? queryParams : queryParams + `&fromIssueDate=${filters.fromIssueDate}&tillIssueDate=${filters.tillIssueDate}`;
    let headers = this.getHeaders();
    return await lastValueFrom(this.http.get(`${this.apiUrl}/api/vehicles`, { headers }));
  }

  async getCustomerLedgerAsync(customerId: string, pageDetails: any) 
  {
    let headers = this.getHeaders();
    let response = await lastValueFrom(this.http.get(`${this.apiUrl}/invoices/customers/${customerId}/transactions?pageNo=${pageDetails.pageNo}&pageSize=${pageDetails.pageSize}`, {
      headers
    }));
    return response;
  }

  async getSupplierLedgerAsync(supplierId: string, pageDetails: any)
  {
    let headers = this.getHeaders();
    let response = await lastValueFrom(this.http.get(`${this.apiUrl}/suppliers/${supplierId}/transactions?pageNo=${pageDetails.pageNo}&pageSize=${pageDetails.pageSize}`, {
      headers
    }));
    return response;
  }
  
  async downloadInvoiceAsync(invoiceNos : string[]) : Promise<any> {
    let headers = this.getHeaders();
    let response = await lastValueFrom(this.http.post(`${this.apiUrl}/invoices/pdf/download`, invoiceNos, {
      headers, 
      responseType : 'blob'
    }));
    const blob = new Blob([response], { type: 'application/pdf' });

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob); 
    link.download = 'invoices.pdf'; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(link.href);
  }

  async downloadSummaryAsync(filters: any, pageDetails: any) : Promise<any> {
    let queryParams =  !(!!filters?.invoiceNo) ? "" : `&invoiceNo=${filters.invoiceNo}`;
    queryParams = (!(!!filters.fromIssueDate) ||  !(!!filters.tillIssueDate)) ? queryParams : queryParams + `&fromIssueDate=${filters.fromIssueDate}&tillIssueDate=${filters.tillIssueDate}`;
    let headers = this.getHeaders();
    let response = await lastValueFrom(this.http.get(`${this.apiUrl}/invoices/summary/download?pageNo=${pageDetails.pageNo}&pageSize=${pageDetails.pageSize}${queryParams}`, {
      headers, 
      responseType : 'blob'
    }));
    const blob = new Blob([response], { type: 'text/csv' });
    
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob); 
    link.download = 'summary.csv'; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(link.href);
  }
  

  async sendMailAsync(invoiceNos : string[]) {
    let headers = this.getHeaders();
    let response = await lastValueFrom(this.http.post(`${this.apiUrl}/invoices/pdf/send`, invoiceNos, {
      headers
    }));
    return response;
  }

  async createInvoiceAsync(invoice: any) {
    let headers = this.getHeaders();
    let response = await lastValueFrom(this.http.post(`${this.apiUrl}/invoices/create`, invoice, {
      headers
    }));
    return response;
  }

  // async getLedgerAsync(customerId: string, pageDetails: any) {
  //   let headers = this.getHeaders();
  //   let response = await lastValueFrom(this.http.get(`${this.apiUrl}ledger/customer/${customerId}?pageNo=${pageDetails.pageNo}&pageSize=${pageDetails.pageSize}`, {
  //     headers
  //   }));
  //   return response;
  // }

  // async addLedgerEntryAsync(entry: any) {
  //   let headers = this.getHeaders();
  //   let response = await lastValueFrom(this.http.post(`${this.apiUrl}ledger`, entry, {
  //     headers
  //   }));
  //   return response;
  // }

  async editInvoiceAsync(id: string, invoice: any) {
    let headers = this.getHeaders();
    let response = await lastValueFrom(this.http.put(`${this.apiUrl}/invoices/${id}`, invoice, {
      headers
    }));
    return response;
  }

  async addSupplierAsync(supplier: any)
  {
    let headers = this.getHeaders();
    let response = await lastValueFrom(this.http.post(`${this.apiUrl}/suppliers`, supplier, {
      headers
    }));
    return response;
  }

  async addSupplyAsync(supply: any)
  {
    let headers = this.getHeaders();
    let response = await lastValueFrom(this.http.post(`${this.apiUrl}/supply`, supply, {
      headers
    }));
    return response;
  }


  async getSuppliersAsync()
  {
    let headers = this.getHeaders();
    let response = await lastValueFrom(this.http.get(`${this.apiUrl}/suppliers`, {
      headers
    }));
    return response;
  }

  async getSuppliesAsync(pageDetails: any)
  {
    let headers = this.getHeaders();
    let response = await lastValueFrom(this.http.get(`${this.apiUrl}/supply?pageNo=${pageDetails.pageNo}&pageSize=${pageDetails.pageSize}&transactionType=1`, {
      headers
    }));
    return response;
  }

  async getSupplierBalanceAsync(supplierId: string , timestamp: number)
  {
    let headers = this.getHeaders();
    let response = await lastValueFrom(this.http.get(`${this.apiUrl}/suppliers/${supplierId}/balance?timestamp=${timestamp}`, {
      headers
    }));
    return response;
  }

  async addCustomerTransactionAsync(ledgerEntry: any)
  {
    let headers = this.getHeaders();
    let response = await lastValueFrom(this.http.post(`${this.apiUrl}/invoices/transactions`, ledgerEntry, {
      headers
    }));
    return response;
  }

  async addSupplierTransactionAsync(ledgerEntry: any)
  {
    let headers = this.getHeaders();
    let response = await lastValueFrom(this.http.post(`${this.apiUrl}/suppliers/transactions`, ledgerEntry, {
      headers
    }));
    return response;
  }


  async addSupplierPaymentAsync(body: any)
  {
    let headers = this.getHeaders();
    let response = await lastValueFrom(this.http.post(`${this.apiUrl}/supply/pay`, body, {
      headers
    }));
    return response;
  }


  // private methods
  private getHeaders() {
    const token = localStorage.getItem('authToken'); 

    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Add Bearer token to headers
    });
  }
}
