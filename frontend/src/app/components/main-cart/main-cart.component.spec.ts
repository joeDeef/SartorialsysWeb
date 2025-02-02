import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainCartComponent } from './main-cart.component';

describe('MainCartComponent', () => {
  let component: MainCartComponent;
  let fixture: ComponentFixture<MainCartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainCartComponent]
    });
    fixture = TestBed.createComponent(MainCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
