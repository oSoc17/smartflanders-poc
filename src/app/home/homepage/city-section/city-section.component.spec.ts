import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CitySectionComponent } from './city-section.component';

describe('CitySectionComponent', () => {
  let component: CitySectionComponent;
  let fixture: ComponentFixture<CitySectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CitySectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CitySectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
