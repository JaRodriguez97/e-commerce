import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsDetailsRoutingModule } from './products-details-routing.module';
import { ProductsDetailsComponent } from './products-details.component';


@NgModule({
  declarations: [
    ProductsDetailsComponent
  ],
  imports: [
    CommonModule,
    ProductsDetailsRoutingModule
  ]
})
export class ProductsDetailsModule { }
