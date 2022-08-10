import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnoDetailsComponent } from './techno-details.component';

describe('TechnoDetailsComponent', () => {
  let component: TechnoDetailsComponent;
  let fixture: ComponentFixture<TechnoDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechnoDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnoDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
