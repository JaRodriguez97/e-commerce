import { NgxSpinnerService } from 'ngx-spinner';
import { Component, Input, OnInit } from '@angular/core';
import {
  faEye,
  faHeart,
  faShare,
  faShoppingCart,
} from '@fortawesome/free-solid-svg-icons';
import { disenoInterface } from '@models/diseno.interface';
import { DisenosService } from '@service/Disenos/disenos.service';
import { DocumentData } from 'firebase/firestore';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  @Input('products') public products!: disenoInterface[] | DocumentData[];
  faShoppingCart = faShoppingCart;
  faHeart = faHeart;
  faShare = faShare;
  faEye = faEye;

  constructor(
    public disenosService: DisenosService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {}
}
