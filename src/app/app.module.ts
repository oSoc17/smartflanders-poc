import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { ParkingDataService} from './services/parking-data.service';
import { AppRoutingModule } from './app.routes';
import { HomepageComponent } from './home/homepage/homepage.component';
import { MdCardModule, MdButtonModule, MdToolbarModule } from '@angular/material';
import { DetailspageComponent } from './details/detailspage/detailspage.component';
import { ParkingCardComponent } from './home/homepage/parking-card/parking-card.component';
import { NavbarComponent } from './shared/nav/navbar/navbar.component';
import { DoughnutComponent } from './shared/charts/doughnut/doughnut.component';
import { LineComponent } from './shared/charts/line/line.component';
import { ScatterComponent } from './shared/charts/scatter/scatter.component';
import { TimeFrameSelectComponent } from './details/time-frame-select/time-frame-select.component';
import { FooterComponent } from './shared/footer/footer/footer.component';
import { MomentModule } from 'angular2-moment';
import { BreadcrumbComponent } from './shared/nav/breadcrumb/breadcrumb.component';
import { ComparepageComponent } from './compare/comparepage/comparepage.component';
import { ParkingCompareCardComponent } from './compare/comparepage/parking-compare-card/parking-compare-card.component';
import { ParkingCompareCardAddComponent } from './compare/comparepage/parking-compare-card-add/parking-compare-card-add.component';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    DetailspageComponent,
    ParkingCardComponent,
    NavbarComponent,
    DoughnutComponent,
    LineComponent,
    ScatterComponent,
    TimeFrameSelectComponent,
    FooterComponent,
    BreadcrumbComponent,
    ComparepageComponent,
    ParkingCompareCardComponent,
    ParkingCompareCardAddComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    MdCardModule,
    MdButtonModule,
    MdToolbarModule,
    FormsModule,
    MomentModule
    ],
  providers: [ParkingDataService],
  bootstrap: [AppComponent]
})

export class AppModule { }
