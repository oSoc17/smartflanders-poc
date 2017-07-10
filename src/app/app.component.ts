import { Component, OnInit } from '@angular/core';
import { DataService } from './services/data.service';
import Parking from './models/parking';
import n3 from 'n3';


import Triple from './models/triple';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'app';
  public parkings: Array<Parking>;
  private dataService: DataService;
  private N3Util;

  constructor(dataService: DataService) {
    this.dataService = dataService;
  }

  ngOnInit() {
    this.N3Util = n3.Util;

    this.dataService.getParkings().then(store => {
      console.log(store.getTriples(null, 'dct:description'));
      store.getTriples(null, 'dct:description').forEach(parking => {

        this.N3Util.getLiteralValue(parking.object);
      });
    });
  }
}

