import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingCardComponent } from './parking-card.component';

describe('ParkingCardComponent', () => {
  let component: ParkingCardComponent;
  let fixture: ComponentFixture<ParkingCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParkingCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParkingCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
