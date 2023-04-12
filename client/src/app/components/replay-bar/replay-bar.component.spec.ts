import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplayBarComponent } from './replay-bar.component';

describe('ReplayBarComponent', () => {
  let component: ReplayBarComponent;
  let fixture: ComponentFixture<ReplayBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReplayBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReplayBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
