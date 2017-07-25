import { Observable } from 'rxjs/Observable';
import { ParkingDataService } from './../../../services/parking-data.service';
import { Component, OnInit , Input} from '@angular/core';
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
  public parkings: Array<Parking>;
  public parkingObservable: Array<Observable<Measurement>>

  constructor(private parkingdataservice: ParkingDataService, private router: Router) { }

ngOnInit() {
  this.parkingdataservice.getParkings(this.cityUrl).subscribe(parking => {
    this.parkings = parking;
  })
}
  goToDetails(parking: Parking, cityUrl: string) {
    this.router.navigate(['/parkings', parking.id, cityUrl]);
  }

}

