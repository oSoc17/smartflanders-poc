import { Component, OnInit } from '@angular/core';
import { DataService } from './services/data.service';
import n3 from 'n3';
import Parking from './models/parking';

import Triple from './models/triple';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'app';
  public parkings: Array<Parking> = [];
  private dataService: DataService;
  private N3Util;

  constructor(dataService: DataService) {
    this.dataService = dataService;
  }

  ngOnInit() {
    this.N3Util = n3.Util;
    this.dataService.get_data().then(response => {
      //this.triples = response;
    });
    this.getParkings();
    this.getParkingData();


  }

private getParkings() {
  
    this.dataService.getParkings().then(store => {
      let names:Array<String>;
      let ids: Array<String>;
      store.getTriples(null, 'rdfs:label').forEach(parking => {
      let  _parking = this.N3Util.getLiteralValue(parking.object);
      if(_parking.substring(0,3).match(/P[0-9]*$/)){
         this.parkings.push(new Parking( _parking.substring(0, 3), _parking.substring(4, _parking.length)));
      };
    });    
  });
}
private getParkingData(){
  this.dataService.get_data().then(result => {
      console.log(result);
  })

}

}

