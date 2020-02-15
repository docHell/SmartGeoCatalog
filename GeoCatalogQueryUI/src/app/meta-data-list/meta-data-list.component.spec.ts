import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetaDataListComponent } from './meta-data-list.component';

describe('MetaDataListComponent', () => {
  let component: MetaDataListComponent;
  let fixture: ComponentFixture<MetaDataListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetaDataListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetaDataListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
