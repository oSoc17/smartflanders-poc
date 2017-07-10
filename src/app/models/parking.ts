export default class Parking {
  public name: string;
  public id: string;
  public currentVacantSpaces: number;
  public currentFilledSpaces: number;
  public totalSpaces: number;
  public uri: string;
  public historicVacantSpaces: Array<number>;

<<<<<<< HEAD
  constructor(name, id, uri){
    this.uri = uri;
=======
  constructor(name, id) {
>>>>>>> bcab49600ac27f55dc25fd04fc4c29bd88ac836b
    this.name = name;
    this.id = id;
    this.currentVacantSpaces = 0;
    this.currentFilledSpaces = 0;
    this.totalSpaces = 0;
    this.historicVacantSpaces = [];
  }
}
