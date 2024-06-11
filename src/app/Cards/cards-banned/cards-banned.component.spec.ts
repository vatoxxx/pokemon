import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsBannedComponent } from './cards-banned.component';

describe('CardsBannedComponent', () => {
  let component: CardsBannedComponent;
  let fixture: ComponentFixture<CardsBannedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardsBannedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardsBannedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
