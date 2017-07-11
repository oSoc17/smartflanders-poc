import { Component, OnInit } from '@angular/core';
import { DataService } from './services/data.service';
import n3 from 'n3';
import Parking from './models/parking';
import find from 'lodash/find';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  public parkings: Array<Parking> = [];
  private dataService: DataService;
  private N3Util;

  constructor(dataService: DataService) {
    this.dataService = dataService;
  }

  ngOnInit() {
    this.N3Util = n3.Util;
    this.getParkings();
    this.getParkingData();
     setInterval(() => { this.getParkingData(); }, 15000);
  }

  private getParkings() {
    this.dataService.getParkings().then(store => {
      store.getTriples(null,'rdf:type' ,'datex:UrbanParkingSite').forEach(parking => {
       const _parking = this.N3Util.getLiteralValue(parking.object);
        if (_parking.substring(0, 3).match(/P[0-9]*$/)) {
         this.parkings.push(new Parking( _parking.substring(0, 3), _parking.substring(4, _parking.length),parking.subject));
        };
    });    
  });
}

private getParkingData(){
  this.dataService.get_data().then(store => {
        //let _parking = find(this.parkings, function(e){ return e.uri === element.subject});
        //this.parkings.
        let _parking = store.getTriples(this.parkings, null, null)
        this
        if(_parking){
       //     _parking.currentVacantSpaces = parseInt(element.object);
        };
      
    })
  }
}
