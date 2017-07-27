export default class ParkingChart {

  public label: string;
  public data = [];
  public borderColor: string;
  public fill: boolean;
  public showLine: boolean;
  public pointRadius: number;
  public pointStyle: string;
  public borderWidth: number;

  constructor(label, data, borderColor) {
    this.label = label;
    this.data = data;
    this.borderColor = borderColor;
    this.fill = false;
    this.showLine = true;
    this.pointRadius = 1;
    this.pointStyle = 'line';
    this.borderWidth = 2;
  }
}
