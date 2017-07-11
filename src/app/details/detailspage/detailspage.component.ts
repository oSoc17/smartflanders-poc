import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { ParkingDataService } from './../../services/parking-data.service';
import Parking from './../../models/parking'
import Chart from 'chart.js';
import { find } from 'lodash';

@Component({
  selector: 'app-detailspage',
  templateUrl: './detailspage.component.html',
  styleUrls: ['./detailspage.component.css']
})

export class DetailspageComponent implements OnInit {

  public data = {
    labels: [
      'Free spaces',
      'Total spaces'
    ],
    datasets: [{
      data: [],
      backgroundColor: [
        '#FF6384',
        '#36A2EB'
      ],
      hoverBackgroundColor: [
        '#FF6384',
        '#36A2EB'
      ]
    }]
  };
  public donutChart;
  public ctx;
  private parkingDataService: ParkingDataService;
  private parking: Parking;

  constructor(
    private _parkingDataService: ParkingDataService,
    private route: ActivatedRoute,
    private router: Router){
    this.parkingDataService = _parkingDataService;
  }

  ngOnInit() {

    this.drawChart();
       let id = this.route.snapshot.paramMap.get('id');
        this.parkingDataService.getParkings().then(result => {
      this.parking = find(result, function (o) {
        return o.id == id
      });
    }).then(() => {
      this._parkingDataService.getNewestParkingData(this.parking.uri).then(result => {
        this.addData(this.donutChart, [parseInt(result.value), this.parking.totalSpaces - parseInt(result.value)]);
      })
    })
    console.log(this.data);
    this.donutChart.update();  

    
  }


  private drawChart(){
       this.ctx = document.getElementById('donut-chart');
        this.donutChart = new Chart(this.ctx, {
      type: 'doughnut',
      data: this.data,
      options: {
        label: ["Free Spaces", "Total spaces"],
        rotation: -1.25 * Math.PI,
        circumference: 1.5 * Math.PI,
        legend: {
          display: false
        },
      },
      pieceLabel: {
        mode: 'label',
        fontSize: 14,
        fontStyle: 'bold',
        fontColor: '#000',
        fontFamily: '"Lucida Console", Monaco, monospace'
      }
    });
  }


  private addData(chart, data) {
    chart.data.datasets.forEach((dataset) => {
      dataset.data.pop();
      dataset.data.pop();
      dataset.data.push(data);
    });
    chart.update();
  }
}


