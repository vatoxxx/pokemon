import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllDecksComponent } from './all-decks.component';

describe('AllDecksComponent', () => {
  let component: AllDecksComponent;
  let fixture: ComponentFixture<AllDecksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllDecksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllDecksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
