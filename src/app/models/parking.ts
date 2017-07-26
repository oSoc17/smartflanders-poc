export default class Parking {

  public name: string;
  public totalSpaces: number;
  public uri: string;
  public id: string;
  public cityUrl: string;

  constructor(name, uri, id, totalSpaces, cityUrl) {
    this.cityUrl = cityUrl;
    this.uri = uri;
    this.name = name;
    this.totalSpaces = totalSpaces;
    this.id = id;
  }
}
