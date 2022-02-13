import { TestBed } from '@angular/core/testing';

import { FinancialAndLegalServiceService } from './financial-and-legal-service.service';

describe('FinancialAndLegalServiceService', () => {
  let service: FinancialAndLegalServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinancialAndLegalServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
