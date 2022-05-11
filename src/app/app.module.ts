import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ClientViewComponent } from './components/client-view/client-view.component';
import { ClientViewStandaloneComponent } from './components/client-view-standalone/client-view-standalone.component';

@NgModule({
  declarations: [
    AppComponent,
    ClientViewComponent,
    ClientViewStandaloneComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
