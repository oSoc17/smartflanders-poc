import { Component } from '@angular/core';
import { DataService } from './services/data.service';

import Triple from './models/triple';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'app';
  public triples: Array<Triple> = [];

constructor(private dataService: DataService) {
  dataService.get_data().then(response => {
      console.log(response);
      this.triples = response;
    });
  }
}

