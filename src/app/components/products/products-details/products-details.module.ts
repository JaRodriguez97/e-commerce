import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ProductsDetailsRoutingModule } from './products-details-routing.module';
import { ProductsDetailsComponent } from './products-details.component';

@NgModule({
  declarations: [ProductsDetailsComponent],
  imports: [FontAwesomeModule, CommonModule, ProductsDetailsRoutingModule],
})
export class ProductsDetailsModule {}
