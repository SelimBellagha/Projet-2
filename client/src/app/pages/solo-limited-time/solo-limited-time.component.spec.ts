import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoloLimitedTimeComponent } from './solo-limited-time.component';

describe('SoloLimitedTimeComponent', () => {
  let component: SoloLimitedTimeComponent;
  let fixture: ComponentFixture<SoloLimitedTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoloLimitedTimeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoloLimitedTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
