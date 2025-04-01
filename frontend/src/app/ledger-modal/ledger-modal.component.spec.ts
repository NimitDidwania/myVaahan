import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgerModalComponent } from './ledger-modal.component';

describe('LedgerModalComponent', () => {
  let component: LedgerModalComponent;
  let fixture: ComponentFixture<LedgerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LedgerModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LedgerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
