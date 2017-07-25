export default class Measurement {
  public timestamp: number;
  public value: any;
  public parkingUrl: string;

  constructor(timestamp, value, parkingUrl) {
    this.timestamp = timestamp;
    this.value = value;
    this.parkingUrl = parkingUrl;
  }
}
