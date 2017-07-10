export default class Parking {
  name: string;
  id: string;
  vacantSpaces: number;
  totalSpaces: number;
  filledSpaces: number;

  constructor(name, id, vacantSpaces, totalSpaces){
    this.name = name;
    this.id = id;
    this.vacantSpaces = vacantSpaces;
    this.totalSpaces = totalSpaces;
    this.filledSpaces = this.totalSpaces - this.totalSpaces;
  }

}
