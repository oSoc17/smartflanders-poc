export default class Parking {
  public name: string;
  public id: string;
  public vacantSpaces: number;
  public totalSpaces: number;
  public filledSpaces: number;

  constructor(name, id){
    this.name = name;
    this.id = id;
    this.vacantSpaces = 0;
    this.totalSpaces = 0;
    this.filledSpaces = 0;
  }
}
