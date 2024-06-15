import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildDeckComponent } from './build-deck.component';

describe('BuildDeckComponent', () => {
  let component: BuildDeckComponent;
  let fixture: ComponentFixture<BuildDeckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuildDeckComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BuildDeckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
