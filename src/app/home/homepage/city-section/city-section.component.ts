import { ParkingDataService } from './../../../services/parking-data.service';
import { Component, OnInit , Input} from '@angular/core';
import { Router } from '@angular/router';
import Parking from './../../../models/parking'
@Component({
  selector: 'app-city-section',
  templateUrl: './city-section.component.html',
  styleUrls: ['./city-section.component.css']
})
export class CitySectionComponent implements OnInit {

  @Input() public cityUrl: string;
  public cities: Array<string> = [];
  public parkings: Array<Parking> = [];

  constructor(private parkingdataservice: ParkingDataService, private router: Router) { }

ngOnInit() {
  this.parkingdataservice.getParkings(this.cityUrl).then(result => {
    this.parkings = result;
  })
}
  goToDetails(parking: Parking, cityUrl: string) {
    this.router.navigate(['/parkings', parking.id, cityUrl]);
  }

}

