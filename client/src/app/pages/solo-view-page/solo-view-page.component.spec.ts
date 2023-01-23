import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoloViewPageComponent } from './solo-view-page.component';

describe('SoloViewPageComponent', () => {
  let component: SoloViewPageComponent;
  let fixture: ComponentFixture<SoloViewPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoloViewPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoloViewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
