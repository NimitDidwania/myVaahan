import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-supplier-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './supplier-modal.component.html',
  styleUrl: './supplier-modal.component.css'
})
export class SupplierModalComponent {
  type: string =  "Add Supplier";
  supplier:any = {

    name: "",
    address: "",
    mobile: ""
  }
  @Output() supplierCreated = new EventEmitter<any>(); 
  submit(){
    this.supplierCreated.emit(this.supplier);
    this.reset();
  }

  reset()
  {
    this.supplier = {

      name: "",
      address: "",
      mobile: ""
    };
  }
}
