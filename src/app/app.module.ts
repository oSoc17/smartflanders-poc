import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http' 
import { AppComponent } from './app.component';

import { DataService} from './services/data.service';
import { HomepageComponent } from './details/homepage/homepage.component';
import { DetailspageComponent } from './details/detailspage/detailspage.component';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    DetailspageComponent
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})

export class AppModule { }
