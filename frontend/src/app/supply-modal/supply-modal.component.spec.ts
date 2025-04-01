import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplyModalComponent } from './supply-modal.component';

describe('SupplyModalComponent', () => {
  let component: SupplyModalComponent;
  let fixture: ComponentFixture<SupplyModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplyModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SupplyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
