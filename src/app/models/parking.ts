export default class Parking {

  public name: string;
  public totalSpaces: number;
  public uri: string;
  public id: string;
  public cityUrl: string;
  public datasetName: string;

  constructor(name, uri, id, totalSpaces, cityUrl, datasetName) {
    this.cityUrl = cityUrl;
    this.uri = uri;
    this.name = name;
    this.totalSpaces = totalSpaces;
    this.id = id;
    this.datasetName = datasetName;
  }
}
