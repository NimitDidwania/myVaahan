import { NgFor } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-supply-modal',
  standalone: true,
  imports: [FormsModule, NgFor],
  templateUrl: './supply-modal.component.html',
  styleUrl: './supply-modal.component.css'
})
export class SupplyModalComponent {
  suppliers: any[] = [];
  type: string = "Add Supply";
  date: string = "";
  serviceCharge: boolean = false;
  supply: any = {
    supplier: null,
    challan: 0,
    vehicle: "",
    weight: 0,
    rate: 0,
    dust: 2.0,
    moisture: 11.0,
    cash: 0,
    remark: ""
  }
  
  @Output() supplyCreated = new EventEmitter<any>(); 


  setSuppliers(suppliers: any[])
  {
    this.suppliers = suppliers;
  }
  submit(){
    this.supply.date = this.toEpoch(this.date);
    this.setTotalAmount();
    this.supplyCreated.emit(this.supply);
    this.reset();
  }

  reset()
  {
    this.supply = {
      supplier: null,
      challan: 0,
      vehicle: "",
      weight: 0,
      rate: 0,
      dust: 2.0,
      moisture: 11.0,
      cash: 0,
      remark: ""
    };
    this.suppliers = [];
  }

  setTotalAmount()
  {
    let dustThresh = 2.0;
    let moisture1x = 11.0;
    let moisture2x = 13.0;
    let dPenalty = Math.max(this.supply.dust - dustThresh, 0);
    let mPenalty = Math.max(this.supply.moisture - moisture1x, 0.0);
    let mPenaltyOver = mPenalty - 2.0;

    if (mPenaltyOver > 0.0) {
        mPenalty += mPenaltyOver;
    }

    let totalReductionPercent = dPenalty + mPenalty;

    this.supply.total = ((this.supply.weight * (1 - totalReductionPercent / 100) * this.supply.rate) - (this.serviceCharge? 150 : 0) - this.supply.cash);
    console.log("test total amount");
    console.log(this.supply);
    console.log(this.supply.total);
  }

  toEpoch(dateString: any) {
    return new Date(`${dateString}T00:00:00Z`).getTime()/1000; // Epoch in milliseconds
  }
}
