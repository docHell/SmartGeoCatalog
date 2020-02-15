import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataUploadComponent } from './metadata-upload.component';

describe('MetadataUploadComponent', () => {
  let component: MetadataUploadComponent;
  let fixture: ComponentFixture<MetadataUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetadataUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetadataUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
