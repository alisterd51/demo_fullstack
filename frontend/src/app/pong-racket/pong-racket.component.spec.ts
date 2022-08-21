import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PongRacketComponent } from './pong-racket.component';

describe('PongRacketComponent', () => {
  let component: PongRacketComponent;
  let fixture: ComponentFixture<PongRacketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PongRacketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PongRacketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
