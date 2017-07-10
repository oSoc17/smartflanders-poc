export default class Parking {
  public name: string;
  public id: string;
  public currentVacantSpaces: number;
  public currentFilledSpaces: number;
  public totalSpaces: number;
  public uri: string;
  public historicVacantSpaces: Array<number>;

  constructor(name, id, uri){
    this.uri = uri;
    this.name = name;
    this.id = id;
    this.currentVacantSpaces = 0;
    this.currentFilledSpaces = 0;
    this.totalSpaces = 0;
    this.historicVacantSpaces = [];
  }
}
