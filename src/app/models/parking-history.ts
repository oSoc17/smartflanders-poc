import Parking from './parking';
import Measurement from './measurement';

export default class ParkingHistory {
  public parking: Parking;
  public timeframe: Measurement[];

  constructor(parking, timeframe) {
    this.parking = parking;
    this.timeframe = timeframe;
  }
}
