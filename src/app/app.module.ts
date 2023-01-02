import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AboutComponent } from '@components/about/about.component';
import { ContactComponent } from '@components/contact/contact.component';
import { IconsContainerComponent } from '@components/icons-container/icons-container.component';
import { InicioComponent } from '@components/Inicio/inicio.component';
import { OrderComponent } from '@components/order/order.component';
import { ProductsComponent } from '@components/products/products.component';
import { ReviewComponent } from '@components/review/review.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxSpinnerModule } from 'ngx-spinner';
import { Database } from './database';

import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    AboutComponent,
    IconsContainerComponent,
    ProductsComponent,
    ReviewComponent,
    ContactComponent,
    OrderComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' }),
    AppRoutingModule,
    FontAwesomeModule,
    FormsModule,
    BrowserAnimationsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [Database],
  bootstrap: [AppComponent],
})
export class AppModule {}
