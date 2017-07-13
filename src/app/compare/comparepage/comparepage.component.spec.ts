import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparepageComponent } from './comparepage.component';

describe('ComparepageComponent', () => {
  let component: ComparepageComponent;
  let fixture: ComponentFixture<ComparepageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComparepageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
