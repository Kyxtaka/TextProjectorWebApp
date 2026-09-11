import { TestBed } from '@angular/core/testing';
import { ApiToken } from './api-token';

describe('ApiToken', () => {
  let service: ApiToken;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiToken);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
