export default class Parking {
  public name: string;
  public totalSpaces: number;
  public uri: string;
  public id: string;

  constructor(name, uri, id, totalSpaces) {
    this.uri = uri;
    this.name = name;
    this.totalSpaces = totalSpaces;
    this.id = id;
  }
}
