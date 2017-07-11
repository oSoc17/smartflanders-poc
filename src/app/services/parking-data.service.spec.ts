import { TestBed, inject } from '@angular/core/testing';

import { ParkingDataService } from './parking-data.service';

describe('DataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ParkingDataService]
    });
  });

  it('should be created', inject([ParkingDataService], (service: ParkingDataService) => {
    expect(service).toBeTruthy();
  }));
});
