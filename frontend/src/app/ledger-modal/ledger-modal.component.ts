import { NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ledger-modal',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './ledger-modal.component.html',
  styleUrl: './ledger-modal.component.css'
})
export class LedgerModalComponent {
  hideTransactionType: boolean = false;
  ledgerData = {
    // date: '',
    total: 0,
    comment: "",
    transactionType: "credit"
  };

  @Output() submitData = new EventEmitter<{ total: number, comment: string, transactionType: string }>();

  initialize()
  {
    this.hideTransactionType = true;
    this.ledgerData.transactionType = "debit";
  }
  submit() {
    this.ledgerData.transactionType = this.ledgerData.transactionType?.toLowerCase();
    this.submitData.emit(this.ledgerData);
    this.ledgerData = {
      // date: '',
      total: 0,
      comment: "",
      transactionType: "credit"
    };
  }
}
