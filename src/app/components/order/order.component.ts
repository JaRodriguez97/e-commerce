import Swal from 'sweetalert2';
import { DOCUMENT, LowerCasePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
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
  orderForm!: FormGroup;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private readonly formBuilder: FormBuilder,
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
      JSON.parse(localStorage.getItem('pedido')!)?.map(
        (pedido: { _id: string }) =>
          this.disenosService
            .getDiseno(pedido._id)
            .then((diseno) => this.pedidos.push(diseno))
      );

    this.orderForm = this.initForm();
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

  orderSubmit(orderForm: FormGroup) {
    if (orderForm.invalid) {
      Swal.fire({
        icon: 'warning',
        html: '<span>Por favor diligencie los campos obligatorios para poder finalizar el pedido</span>',
      });
    } 
      console.log(
        '🚀 ~ file: order.component.ts:71 ~ OrderComponent ~ orderSubmit ~ orderForm',
        orderForm
      );
  }

  initForm(groupForm?: {
    nombre: (String | ValidationErrors | null)[];
    apellidos: (String | ValidationErrors | null)[];
    email: (String | LowerCasePipe | ValidationErrors | null)[];
    fechaHora: (String | ValidationErrors | null)[];
    celular: (Number | ValidationErrors | null)[];
    direccion: (String | ValidationErrors | null)[];
    detallesUbicacion: (String | ValidationErrors | null)[];
    detallesPedido: (String | ValidationErrors | null)[];
  }): FormGroup {
    // if (groupForm && groupForm.nombres && groupForm.nombres.length)
    //   return this.formBuilder.group(groupForm);

    return this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      apellido: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.minLength(5)]],
      fechaHora: ['', [Validators.required, Validators.minLength(5)]],
      celular: ['', [Validators.required, Validators.minLength(10)]],
      direccion: ['', [Validators.required, Validators.minLength(5)]],
      detallesUbicacion: ['', [Validators.minLength(5)]],
      detallesPedido: ['', [Validators.minLength(5)]],
    });
  }
}
