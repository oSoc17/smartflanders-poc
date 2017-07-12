import { Component, Input, OnInit } from '@angular/core';
import Parking from './../../../models/parking'

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {

  @Input() private parking: Parking;

  constructor() { }

  ngOnInit() {
  }

}
