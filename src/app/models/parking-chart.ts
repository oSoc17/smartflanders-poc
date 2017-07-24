export default class ParkingChart {

  public label: string;
  public data = [];
  public borderColor: string;
  public fill: boolean;

  constructor(label, data, borderColor) {
    this.label = label;
    this.data = data;
    this.borderColor = borderColor;
    this.fill = false;
  }
}
