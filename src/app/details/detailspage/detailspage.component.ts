import {Component, OnInit} from '@angular/core';
import TimestampRange from '../../models/timestamp-range';
import { ParkingDataService } from '../../services/parking-data.service';
import * as Rx from 'rxjs/Rx';


@Component({
  selector: 'app-detailspage',
  templateUrl: './detailspage.component.html',
  styleUrls: ['./detailspage.component.css'],
  providers: [ParkingDataService]
})

export class DetailspageComponent implements OnInit {
  private rangeData = new Rx.Subject();

  constructor(private ds: ParkingDataService) {}

  ngOnInit() {}

  onRangeChange($event) {
    console.log('On range change in details page:');
    this.getData($event);
  }

  getData(range: TimestampRange) {
    console.log(range);
    const _this = this;
    this.ds.getParkingHistory('https://stad.gent/id/parking/P10', range.from, range.to, (data) => {
      _this.rangeData.next(data);
    });
  }
}

