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
<<<<<<< HEAD
    this.dataService.get_data().then(response => {
      console.log(response);
      this.triples = response;
    });
<<<<<<< HEAD
    this.dataService.getParkings().then(response => {
      console.log(response.getTriples(null, 'dct:description'));
=======
=======

>>>>>>> 2ad3996eb3ccac905cdc46f9317add718d94376a
    this.dataService.getParkings().then(store => {
      console.log(store.getTriples(null, 'dct:description'));
      store.getTriples(null, 'dct:description').forEach(parking => {

        this.N3Util.getLiteralValue(parking.object);
      });
>>>>>>> 019f95616874e8800c1e432431db8871f1ada502
    });
    
  }
}

