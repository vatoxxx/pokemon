import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFavcardsComponent } from './user-favcards.component';

describe('UserFavcardsComponent', () => {
  let component: UserFavcardsComponent;
  let fixture: ComponentFixture<UserFavcardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserFavcardsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserFavcardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
