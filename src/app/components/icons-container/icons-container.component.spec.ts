import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconsContainerComponent } from './icons-container.component';

describe('IconsContainerComponent', () => {
  let component: IconsContainerComponent;
  let fixture: ComponentFixture<IconsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IconsContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
