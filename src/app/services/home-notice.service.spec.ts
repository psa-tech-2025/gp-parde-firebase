import { TestBed } from '@angular/core/testing';

import { HomeNoticeService } from './home-notice.service';

describe('HomeNoticeService', () => {
  let service: HomeNoticeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeNoticeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
