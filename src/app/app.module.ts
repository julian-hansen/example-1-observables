import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ClientViewComponent } from './components/client-view/client-view.component';
import { ClientViewStandaloneComponent } from './components/client-view-standalone/client-view-standalone.component';
import { SwitchMapSampleComponent } from './components/switch-map-sample/switch-map-sample.component';

@NgModule({
  declarations: [
    AppComponent,
    ClientViewComponent,
    ClientViewStandaloneComponent,
    SwitchMapSampleComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
