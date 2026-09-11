import { TestBed } from '@angular/core/testing';
import { ApiNetwork } from './api-network';

describe('ApiNetwork', () => {
  let service: ApiNetwork;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiNetwork);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
