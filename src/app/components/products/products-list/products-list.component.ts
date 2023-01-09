import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import {
  faEye,
  faHeart,
  faShare,
  faShoppingCart,
  faBan,
  faArrowUpFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import { disenoInterface } from '@models/diseno.interface';
import { DisenosService } from '@service/Disenos/disenos.service';
import { DocumentData } from 'firebase/firestore';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css'],
})
export class ProductsListComponent implements OnInit {
  @Input('products') public products!: disenoInterface[] | DocumentData[];
  faShoppingCart = faShoppingCart;
  faHeart = faHeart;
  faShare = faShare;
  faEye = faEye;
  faArrowUpFromBracket = faArrowUpFromBracket;
  precioTotal!: number;

  constructor(
    public appComponent: AppComponent,
    public disenosService: DisenosService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  getTotalDescuento(diseno: disenoInterface | DocumentData) {
    return diseno.precio - (diseno.precio! * diseno.descuento!) / 100;
  }

  getDetails(_id: string) {
    this.appComponent.paragraphSpinner = 'Cargando...';

    this.spinner
      .show()
      .then(() => this.router.navigate(['products-details', _id]));
  }

  addToCar(_id: string, i: number) {
    this.appComponent.addToCar(_id, i).then(() => this.ngOnInit());
  }

  restToCar(_id: string, i: number) {
    this.appComponent.restToCar(_id, i).then(() => this.ngOnInit());
  }
}
