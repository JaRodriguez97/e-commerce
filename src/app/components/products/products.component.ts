import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit } from '@angular/core';
import {
  faEye,
  faHeart,
  faShare,
  faShoppingCart,
} from '@fortawesome/free-solid-svg-icons';
import { diseñoInterface } from '@models/diseno.interface';
import { DiseñosService } from '@service/Disenos/disenos.service';
import { DocumentData } from 'firebase/firestore';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  faShoppingCart = faShoppingCart;
  faHeart = faHeart;
  faShare = faShare;
  faEye = faEye;
  productos: diseñoInterface[] | DocumentData[] = [];

  constructor(
    private diseñosService: DiseñosService,
    private spinner: NgxSpinnerService
  ) {
    spinner.show();
  }

  ngOnInit(): void {
    this.spinner.show().then(() => {
      this.diseñosService
        .getDiseños()
        .then((diseños) => (this.productos = diseños))
        .then(() => this.spinner.hide());
    });

    console.log(this.productos);
  }
}
