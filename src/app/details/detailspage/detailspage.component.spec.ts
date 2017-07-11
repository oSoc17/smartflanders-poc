import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailspageComponent } from './detailspage.component';

describe('DetailspageComponent', () => {
  let component: DetailspageComponent;
  let fixture: ComponentFixture<DetailspageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailspageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailspageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
