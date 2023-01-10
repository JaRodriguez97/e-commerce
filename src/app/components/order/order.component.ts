import { DOCUMENT } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { AppComponent } from '@app/app.component';
import { userInterface } from '@app/models/users.interface';
import { disenoInterface } from '@models/diseno.interface';
import { DisenosService } from '@service/Disenos/disenos.service';
import { DocumentData } from 'firebase/firestore';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit {
  @Input('user') user: userInterface | undefined;
  @ViewChild('order__list') order__list!: ElementRef;
  @ViewChild('smmok') smmok!: ElementRef;

  pedidos!: (disenoInterface | DocumentData)[];
  formBoolean: Boolean = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    public appComponent: AppComponent,
    private disenosService: DisenosService,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.pedidos = !this.pedidos || !this.pedidos.length ? [] : this.pedidos;

    if (this.user && this.user.pedido && this.user.pedido.length)
      this.user.pedido.map((pedido) =>
        this.disenosService
          .getDiseno(pedido._id)
          .then((diseno) => this.pedidos.push(diseno))
      );
    else
      JSON.parse(localStorage.getItem('pedido')!).map(
        (pedido: { _id: string }) =>
          this.disenosService
            .getDiseno(pedido._id)
            .then((diseno) => this.pedidos.push(diseno))
      );
  }

  getOutOrder() {
    this.renderer.removeClass(this.order__list.nativeElement, 'active');
    this.renderer.removeClass(this.smmok.nativeElement, 'active');
    this.appComponent.getOutOrder();
    this.formBoolean = false;
  }

  getFinishOrder() {
    this.formBoolean = true;
    this.renderer.addClass(this.order__list.nativeElement, 'active');
    this.renderer.addClass(this.smmok.nativeElement, 'active');
  }
}
