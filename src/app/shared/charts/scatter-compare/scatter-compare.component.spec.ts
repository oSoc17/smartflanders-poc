import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScatterCompareComponent } from './scatter-compare.component';

describe('ScatterCompareComponent', () => {
  let component: ScatterCompareComponent;
  let fixture: ComponentFixture<ScatterCompareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScatterCompareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScatterCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
