export default class Measurement {
  public timestamp: number;
  public value: any;
  public parkingUri: string;

  constructor(timestamp, value) {
    this.timestamp = timestamp;
    this.value = value;
  }
}