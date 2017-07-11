import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http'
import { AppComponent } from './app.component';
import { ParkingDataService} from './services/parking-data.service';
import { AppRoutingModule } from './app.routes';
import { HomepageComponent } from './home/homepage/homepage.component';
import { DetailspageComponent } from './details/detailspage/detailspage.component';
import { NavbarComponent } from './shared/nav/navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    DetailspageComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [ParkingDataService],
  bootstrap: [AppComponent]
})

export class AppModule { }
