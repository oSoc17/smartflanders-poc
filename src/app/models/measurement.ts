export default class Measurement {
  public timestamp: number;
  public value: any;

  constructor(timestamp, value) {
    this.timestamp = timestamp;
    this.value = value;
  }
}
