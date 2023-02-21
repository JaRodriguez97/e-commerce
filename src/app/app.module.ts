import { NgOptimizedImage } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from '@app/app-routing.module';
import { AppComponent } from '@app/app.component';
import { AboutComponent } from '@components/about/about.component';
import { ContactComponent } from '@components/contact/contact.component';
import { IconsContainerComponent } from '@components/icons-container/icons-container.component';
import { InicioComponent } from '@components/Inicio/inicio.component';
import { OrderComponent } from '@components/order/pre-order/order.component';
import { ProductsListComponent } from '@components/products/products-list/products-list.component';
import { ReviewComponent } from '@components/review/review.component';
import { ProfileComponent } from '@components/user/profile/profile.component';
import { UserComponent } from '@components/user/user.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    AboutComponent,
    IconsContainerComponent,
    ReviewComponent,
    ContactComponent,
    OrderComponent,
    UserComponent,
    ProductsListComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' }),
    AppRoutingModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgOptimizedImage,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [OrderComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
