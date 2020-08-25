import 'core-js/features/reflect';
import 'zone.js';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { enableProdMode, NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

enableProdMode();

@Component({
  template: '<div>Look to the console on IE11.</div>',
  selector: 'app-root'
})
class AppComponent {

  constructor(http: HttpClient) {
    http.get('https://jsonplaceholder.typicode.com/todos/1').subscribe((result) => console.log(result));
  }
}

@NgModule({
  bootstrap: [
    AppComponent
  ],
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
  ],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);


console.log('------------------------------------');
