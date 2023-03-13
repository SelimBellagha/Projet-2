import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheatComponent } from './cheat.component';

describe('CheatComponent', () => {
  let component: CheatComponent;
  let fixture: ComponentFixture<CheatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
