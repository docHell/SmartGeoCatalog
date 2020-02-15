import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatuspageComponent } from './statuspage.component';

describe('StatuspageComponent', () => {
  let component: StatuspageComponent;
  let fixture: ComponentFixture<StatuspageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatuspageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatuspageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
