import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PongConfigComponent } from './pong-config.component';

describe('PongConfigComponent', () => {
  let component: PongConfigComponent;
  let fixture: ComponentFixture<PongConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PongConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PongConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
