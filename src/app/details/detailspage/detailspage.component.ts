import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-detailspage',
  templateUrl: './detailspage.component.html',
  styleUrls: ['./detailspage.component.css']
})

export class DetailspageComponent implements OnInit {
  private rangeData;

  constructor() { }

  ngOnInit() {

  }

  onRangeChange($event) {
    console.log('On range change in details page:');
    console.log($event);
  }

  getData(range) {
    console.log('getting data: ' + range);
    this.rangeData = [1, 2, 3];
  }
}

