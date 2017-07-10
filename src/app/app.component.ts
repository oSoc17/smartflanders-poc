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

  constructor(dataService: DataService) {
    this.dataService = dataService;
  }

  ngOnInit() {
    this.dataService.get_data().then(response => {
      console.log(response);
      this.triples = response;
    });
    this.dataService.getParkings().then(response => {
      console.log(response.getTriples(null, 'datex:parkingNumberOfVacantSpaces'));
    });
  }

}

