import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { OrderComponent } from '@components/order/pre-order/order.component';
import {
  faArrowUpFromBracket,
  faShoppingCart,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { productInterface } from '@models/products.interface';
import { ProductsService } from '@service/Products/products.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-products-details',
  templateUrl: './products-details.component.html',
  styleUrls: ['./products-details.component.css'],
})
export class ProductsDetailsComponent implements OnInit {
  product!: productInterface;
  faXmark = faXmark;
  faShoppingCart = faShoppingCart;
  faArrowUpFromBracket = faArrowUpFromBracket;

  constructor(
    public productsService: ProductsService,
    public orderComponent: OrderComponent,
    private spinner: NgxSpinnerService,
    public appComponent: AppComponent,
    private activatedRouter: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.spinner.show().then(() => {
      let { id } = this.activatedRouter.snapshot.params;

      this.productsService.getProduct(id).subscribe(
        (res) => (this.product = res),
        (err) => console.error(err),
        () => this.spinner.hide()
      );
    });
  }

  addToCar(product: productInterface, i?: number) {
    this.spinner.show().then(() => this.appComponent.addToCar(product, i));
  }

  existeCombo(id: string) {
    return this.appComponent.pedidos?.some(
      (productPedido) => productPedido._id == id
    );
  }

  restToCar(_id: string, i?: number) {
    this.appComponent.restToCar(_id, i);
  }
}
