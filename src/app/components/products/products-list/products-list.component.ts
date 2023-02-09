import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { OrderComponent } from '@app/components/order/pre-order/order.component';
import {
  faArrowUpFromBracket,
  faEye,
  faHeart,
  faShare,
  faShoppingCart,
} from '@fortawesome/free-solid-svg-icons';
import { productInterface } from '@models/products.interface';
import { ProductsService } from '@service/Products/products.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css'],
})
export class ProductsListComponent implements OnInit {
  @Input('products') public products!: productInterface[];
  faShoppingCart = faShoppingCart;
  faHeart = faHeart;
  faShare = faShare;
  faEye = faEye;
  faArrowUpFromBracket = faArrowUpFromBracket;
  precioTotal!: number;

  constructor(
    public orderComponent: OrderComponent,
    public appComponent: AppComponent,
    public productsService: ProductsService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  existeCombo(id: string) {
    return this.appComponent.pedidos?.some(
      (productPedido) => productPedido._id == id
    );
  }

  getTotalDescuento(product: productInterface) {
    return product.precio! - (product.precio! * product.descuento!) / 100;
  }

  getDetails(_id: string) {
    this.appComponent.paragraphSpinner = 'Cargando...';

    this.spinner
      .show()
      .then(() => this.router.navigate(['products-details', _id]));
  }

  addToCar(product: productInterface, i: number) {
    this.spinner
      .show()
      .then(() =>
        this.appComponent
          .addToCar(product, i)
          .then(() => setTimeout(() => this.orderComponent.ngOnInit(), 1000))
      );
  }

  restToCar(_id: string, i: number) {
    this.appComponent
      .restToCar(_id, i)
      .then(() => this.orderComponent.ngOnInit());
  }
}
