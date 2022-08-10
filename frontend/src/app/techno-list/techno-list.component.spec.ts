import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnoListComponent } from './techno-list.component';

describe('TechnoListComponent', () => {
  let component: TechnoListComponent;
  let fixture: ComponentFixture<TechnoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechnoListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
