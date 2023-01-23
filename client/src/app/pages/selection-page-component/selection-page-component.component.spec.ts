import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionPageComponentComponent } from './selection-page-component.component';

describe('SelectionPageComponentComponent', () => {
  let component: SelectionPageComponentComponent;
  let fixture: ComponentFixture<SelectionPageComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectionPageComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectionPageComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
