import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OneVsOnePageComponent } from './one-vs-one-page.component';

describe('OneVsOnePageComponent', () => {
  let component: OneVsOnePageComponent;
  let fixture: ComponentFixture<OneVsOnePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OneVsOnePageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OneVsOnePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
