export default class Parking {
  public name: string;
  public totalSpaces: number;
  public uri: string;

  constructor(name, uri) {
    this.uri = uri;
    this.name = name;
    this.totalSpaces = 0;
  }
}
