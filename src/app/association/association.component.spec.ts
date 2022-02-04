import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NaassociationComponent } from './association.component';

describe('NaassociationComponent', () => {
  let component: NaassociationComponent;
  let fixture: ComponentFixture<NaassociationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NaassociationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NaassociationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
