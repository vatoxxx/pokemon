import { TestBed } from '@angular/core/testing';

import { FavoriteCardService } from './favorite-card.service';

describe('FavoriteCardService', () => {
  let service: FavoriteCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoriteCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
