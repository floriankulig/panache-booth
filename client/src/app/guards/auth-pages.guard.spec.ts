import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authPagesGuard } from './auth-pages.guard';

describe('authPagesGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authPagesGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
