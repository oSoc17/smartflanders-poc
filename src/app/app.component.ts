import { Component } from '@angular/core';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'app';

  constructor(private dataService: DataService) {
    dataService.get_data().then(response => {
        console.log('Response in app.compontent.ts' + response)}); 
    };
  }

