import { Observable } from 'rxjs/Observable';
import { ParkingDataService } from './../../../services/parking-data.service';
import { Component, OnInit , Input, NgZone} from '@angular/core';
import { Router } from '@angular/router';
import Parking from './../../../models/parking'
import Measurement from './../../../models/measurement';
@Component({
  selector: 'app-city-section',
  templateUrl: './city-section.component.html',
  styleUrls: ['./city-section.component.css']
})
export class CitySectionComponent implements OnInit {

  @Input() public cityUrl: string;
  public cities: Array<string> = [];
  public parkings: Array<Parking> = [];
  public measurements: Array<any> = [];
  public showCards = false;

  constructor(private parkingdataservice: ParkingDataService, private router: Router,  private zone: NgZone)  { }

ngOnInit() {
  this.parkingdataservice.getParkings(this.cityUrl).subscribe(
      (x) =>  { this.zone.run(() => this.parkings.push(x)); },
      (e) =>  { console.log('onError: %s', e); },
      ()  =>  { this.fetchLatestParkingData(); }
  )
}
fetchLatestParkingData() {
this.parkingdataservice.getNewestParkingDataForCity(this.parkings, this.cityUrl).subscribe(
      (x) =>  { this.zone.run(() => this.measurements.push(x)) },
      (e) =>  { console.log('onError: %s', e); },
      ()  =>  {  this.zone.run(() => this.showCards = true)  }
  )
}
  goToDetails(parking: Parking, cityUrl: string) {
    this.router.navigate(['/detail', parking.id, cityUrl]);
  }
}

