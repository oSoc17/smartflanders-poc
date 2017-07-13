import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingCompareCardAddComponent } from './parking-compare-card-add.component';

describe('ParkingCompareCardAddComponent', () => {
  let component: ParkingCompareCardAddComponent;
  let fixture: ComponentFixture<ParkingCompareCardAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParkingCompareCardAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParkingCompareCardAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
