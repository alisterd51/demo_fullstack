import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnoAddComponent } from './techno-add.component';

describe('TechnoAddComponent', () => {
  let component: TechnoAddComponent;
  let fixture: ComponentFixture<TechnoAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechnoAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnoAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
