import { Component, OnInit } from '@angular/core';
import { DataService } from './services/data.service';
import n3 from 'n3';


import Triple from './models/triple';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'app';
  public triples: Array<Triple> = [];
  private dataService: DataService;
  private N3Util;

  constructor(dataService: DataService) {
    this.dataService = dataService;
  }

  ngOnInit() {
    this.N3Util = n3.Util;
    this.dataService.get_data().then(response => {
      console.log(response);
      this.triples = response;
    });
<<<<<<< HEAD
    this.dataService.getParkings().then(response => {
      console.log(response.getTriples(null, 'dct:description'));
=======
    this.dataService.getParkings().then(store => {
      console.log(store.getTriples(null, 'dct:description'));
      store.getTriples(null, 'dct:description').forEach(parking => {
        console.log(this.N3Util.getLiteralValue(parking.object));
      });
>>>>>>> 019f95616874e8800c1e432431db8871f1ada502
    });
    
  }

}

