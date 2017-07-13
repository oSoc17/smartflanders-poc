import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingCompareCardComponent } from './parking-compare-card.component';

describe('ParkingCompareCardComponent', () => {
  let component: ParkingCompareCardComponent;
  let fixture: ComponentFixture<ParkingCompareCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParkingCompareCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParkingCompareCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
