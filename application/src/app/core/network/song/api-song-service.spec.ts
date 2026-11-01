import { TestBed } from '@angular/core/testing';
import { ApiSongService } from './api-song-service';

describe('ApiSongService', () => {
  let service: ApiSongService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiSongService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
