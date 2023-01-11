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
import { NgxSpinnerService } from 'ngx-spinner';
import { UsersService } from '@app/services/Users/users.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit {
  @Input('user') user!: userInterface | undefined;
  @ViewChild('order__list') order__list!: ElementRef;
  @ViewChild('smmok') smmok!: ElementRef;

  disenosPedido!: (disenoInterface | DocumentData)[];
  formBoolean: Boolean = false;
  orderForm!: FormGroup;

  constructor(
    // @Inject(DOCUMENT) private document: Document,
    private readonly formBuilder: FormBuilder,
    public appComponent: AppComponent,
    private disenosService: DisenosService,
    public spinner: NgxSpinnerService,
    private usersService: UsersService,
    private renderer: Renderer2
  ) {
    setTimeout(() => this.ngOnInit(), 3000);
  }

  ngOnInit() {
    this.disenosPedido =
      !this.disenosPedido || !this.disenosPedido.length
        ? []
        : this.disenosPedido;

    console.log(
      '🚀 ~ file: order.component.ts:59 ~ OrderComponent ~ ngOnInit ~ this.user && this.user.pedido && this.user.pedido.length',
      this.user && this.user.pedido && this.user.pedido.length
    );
    if (this.user && this.user.pedido && this.user.pedido.length) {
      let groupForm: {
        nombre: (String | ValidationErrors | null)[];
        apellido: (String | ValidationErrors | null)[];
        email: (String | LowerCasePipe | ValidationErrors | null)[];
        fechaHora: (String | ValidationErrors | null)[];
        celular: (Number | ValidationErrors | null)[];
        direccion: (String | ValidationErrors | null)[];
        detallesUbicacion: (String | ValidationErrors | null)[];
        detallesPedido: (String | ValidationErrors | null)[];
      } = {
        nombre: [],
        apellido: [],
        email: [],
        celular: [],
        direccion: [],
        fechaHora: ['', [Validators.required, Validators.minLength(5)]],
        detallesUbicacion: [],
        detallesPedido: [],
      };

      if (this.user.nombres)
        groupForm.nombre.push(this.user.nombres, [
          Validators.required,
          Validators.minLength(3),
        ]);
      else
        groupForm.nombre.push('', [
          Validators.required,
          Validators.minLength(3),
        ]);

      if (this.user.apellidos)
        groupForm.apellido.push(this.user.apellidos, [
          Validators.required,
          Validators.minLength(3),
        ]);
      else
        groupForm.apellido.push('', [
          Validators.required,
          Validators.minLength(3),
        ]);

      if (this.user.numeroTelefono)
        groupForm.celular.push(this.user.numeroTelefono, [
          Validators.required,
          Validators.minLength(10),
        ]);
      else
        groupForm.celular.push(0, [
          Validators.required,
          Validators.minLength(10),
        ]);

      if (this.user.email)
        groupForm.email.push(this.user.email, [Validators.minLength(5)]);
      else groupForm.email.push('', [Validators.minLength(5)]);

      if (this.user.direccion)
        groupForm.direccion.push(this.user.direccion, [
          Validators.minLength(5),
        ]);
      else groupForm.direccion.push('', [Validators.minLength(5)]);

      this.user.pedido.map((pedido) =>
        this.disenosService
          .getDiseno(pedido._id)
          .then((diseno) => this.disenosPedido.push(diseno))
      );

      this.initForm(groupForm)
        .then((orderForm) => (this.orderForm = orderForm))
        .finally(() => this.spinner.hide());
    } else {
      this.initForm()
        .then((orderForm) => (this.orderForm = orderForm))
        .then(() =>
          localStorage.getItem('pedido')
            ? JSON.parse(localStorage.getItem('pedido')!)?.map(
                (pedido: { _id: string }) =>
                  this.disenosService
                    .getDiseno(pedido._id)
                    .then((diseno) => this.disenosPedido.push(diseno))
              )
            : this.appComponent.pedidos?.map((pedido: { _id: string }) =>
                this.disenosService
                  .getDiseno(pedido._id)
                  .then((diseno) => this.disenosPedido.push(diseno))
              )
        );
      // .finally(() => this.spinner.hide());
    }
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
    } else if (this.user) {
      let pedidoFinalizado = {
          pedido: this.appComponent.pedidos,
          fecha: new Date(),
          entregado: false,
          datosPedido: orderForm.value,
        },
        pedidosRealizados: userInterface['pedidosRealizados'] = [
          pedidoFinalizado,
        ];

      console.log(
        '🚀 ~ file: order.component.ts:178 ~ OrderComponent ~ orderSubmit ~ pedidosRealizados',
        pedidosRealizados
      );
      // this.usersService.updateUser(this.appComponent.userID);
    } else {
    }
  }

  async initForm(groupForm?: {
    nombre: (String | ValidationErrors | null)[];
    apellido: (String | ValidationErrors | null)[];
    email: (String | LowerCasePipe | ValidationErrors | null)[];
    fechaHora: (String | ValidationErrors | null)[];
    celular: (Number | ValidationErrors | null)[];
    direccion: (String | ValidationErrors | null)[];
    detallesUbicacion: (String | ValidationErrors | null)[];
    detallesPedido: (String | ValidationErrors | null)[];
  }): Promise<FormGroup<any>> {
    if (groupForm) {
      console.log(
        '🚀 ~ file: order.component.ts:162 ~ OrderComponent ~ groupForm',
        groupForm
      );
      return this.formBuilder.group(groupForm);
    }

    return this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      apellido: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.minLength(5)]],
      fechaHora: ['', [Validators.required, Validators.minLength(5)]],
      celular: ['', [Validators.required, Validators.minLength(10)]],
      direccion: ['', [Validators.required, Validators.minLength(5)]],
      detallesUbicacion: [],
      detallesPedido: [],
    });
  }
}
