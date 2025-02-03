import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailModalComponent } from './order-detail-modal.component';

describe('OrderDetailModalComponent', () => {
  let component: OrderDetailModalComponent;
  let fixture: ComponentFixture<OrderDetailModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderDetailModalComponent]
    });
    fixture = TestBed.createComponent(OrderDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
