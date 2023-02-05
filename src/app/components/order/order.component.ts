import {
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { datosPedidoInterface } from '@models/datosPedido.interface';
import { productInterface } from '@models/products.interface';
import { userInterface } from '@models/users.interface';
import { ProductsService } from '@service/Products/products.service';
import { UsersService } from '@service/Users/users.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit {
  @Input('user') user!: userInterface | undefined;
  @ViewChild('order__list') order__list!: ElementRef;
  @ViewChild('smmok') smmok!: ElementRef;

  productsPedido!: productInterface[];
  formBoolean: Boolean = false;
  orderForm!: FormGroup;
  faXmark = faXmark;

  constructor(
    private readonly formBuilder: FormBuilder,
    public appComponent: AppComponent,
    private productsService: ProductsService,
    public spinner: NgxSpinnerService,
    private usersService: UsersService,
    private renderer: Renderer2,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.orderForm && this.orderForm.valid) this.orderForm.reset();

    let groupForm: datosPedidoInterface | undefined,
      pedidos: Array<string> = [],
      userID = localStorage.getItem('userID');

    this.productsPedido =
      !this.productsPedido || !this.productsPedido.length
        ? []
        : this.productsPedido;

    if (userID && userID.length) {
      this.usersService.getUser(userID).subscribe(
        (res) => {
          if (res) {
            if (res.pedido && res.pedido.length) {
              groupForm = {
                nombre: [[Validators.required, Validators.minLength(3)]],
                apellido: [[Validators.required, Validators.minLength(3)]],
                email: [[Validators.minLength(5)]],
                celular: [[Validators.required, Validators.minLength(10)]],
                direccion: [[Validators.minLength(5)]],
                fechaHora: ['', [Validators.required, Validators.minLength(5)]],
                detallesUbicacion: [],
                detallesPedido: [],
              };

              res.nombres
                ? groupForm.nombre.unshift(res.nombres)
                : groupForm.nombre.unshift('');

              res.apellidos
                ? groupForm.apellido.unshift(res.apellidos)
                : groupForm.apellido.unshift('');

              res.numeroTelefono
                ? groupForm.celular.unshift(res.numeroTelefono)
                : groupForm.celular.unshift(0);

              res.email
                ? groupForm.email.unshift(res.email)
                : groupForm.email.unshift('');

              res.direccion
                ? groupForm.direccion.unshift(res.direccion)
                : groupForm.direccion.unshift('');

              pedidos = res.pedido;
            }
          } else throw new Error('Usuario no encontrado');
        },
        (err) => console.error(err),
        () => {
          pedidos.map((_id) =>
            this.productsService.getProduct(_id).subscribe(
              (product) => this.productsPedido.push(product),
              (err) => console.error(err)
            )
          );
          this.initForm(groupForm)
            .then((orderForm) => (this.orderForm = orderForm))
            .finally(() => this.spinner.hide());
        }
      );
    } else {
      pedidos = localStorage.getItem('pedido')
        ? JSON.parse(localStorage.getItem('pedido')!)
        : this.appComponent.pedidos;
      console.log(
        '🚀 ~ file: order.component.ts:113 ~ OrderComponent ~ ngOnInit ~ pedidos',
        pedidos
      );

      pedidos?.map((_id: string) =>
        this.productsService.getProduct(_id).subscribe(
          (res) => {
            console.log(
              '🚀 ~ file: order.component.ts:119 ~ OrderComponent ~ ngOnInit ~ res',
              res
            );
            this.productsPedido.push(res);
          },
          (err) => console.error(err)
        )
      );

      this.initForm(groupForm)
        .then((orderForm) => (this.orderForm = orderForm))
        .catch((err) => console.error(err))
        .finally(() => this.spinner.hide());
    }
  }

  getOutOrder() {
    this.renderer.removeClass(this.order__list.nativeElement, 'active');
    this.renderer.removeClass(this.smmok.nativeElement, 'active');
    this.appComponent.getOutOrder();
    this.formBoolean = false;
  }

  getFinishOrder() {
    if (!this.user || !this.appComponent.userID) {
      Swal.fire({
        icon: 'warning',
        title: 'Deseas iniciar sesión o registrarte?',
        text: 'te haría el trabajo más fácil al llenar los formularios',
        showCancelButton: true,
        cancelButtonText: 'Finalizar Pedido',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Login',
        showConfirmButton: true,
      }).then((res) => {
        if (res.isConfirmed)
          this.router.navigate(['/login']).then(() => this.getOutOrder());
        else if (res.isDenied || res.dismiss) {
          this.formBoolean = true;
          this.renderer.addClass(this.order__list.nativeElement, 'active');
          this.renderer.addClass(this.smmok.nativeElement, 'active');
        }
      });
    } else {
      this.formBoolean = true;
      this.renderer.addClass(this.order__list.nativeElement, 'active');
      this.renderer.addClass(this.smmok.nativeElement, 'active');
    }
  }

  orderSubmit(orderForm: FormGroup) {
    if (orderForm.invalid) {
      Swal.fire({
        icon: 'warning',
        html: '<span>Por favor diligencie los campos obligatorios para poder finalizar el pedido</span>',
      });
      return;
    } else if (this.user) {
      let pedidoFinalizado = {
        pedido: this.appComponent.pedidos,
        fecha: new Date(),
        entregado: false,
        datosPedido: orderForm.value as datosPedidoInterface,
      };

      this.user.pedidosRealizados || this.user.pedidosRealizados!.length
        ? this.user.pedidosRealizados!.push(pedidoFinalizado)
        : (this.user.pedidosRealizados = [pedidoFinalizado]);

      console.log(
        '🚀 ~ file: order.component.ts:160 ~ OrderComponent ~ orderSubmit ~ pedidoFinalizado.datosPedido.direccion',
        pedidoFinalizado.datosPedido.direccion
      );
      if (
        !this.user.direccion &&
        typeof pedidoFinalizado.datosPedido.direccion == 'string'
      )
        this.user.direccion = pedidoFinalizado.datosPedido.direccion;

      console.log(
        '🚀 ~ file: order.component.ts:178 ~ OrderComponent ~ orderSubmit ~ pedidosRealizados',
        this.user
      );
      this.usersService.updateUser(this.user._id!, this.user).subscribe(
        (res) => {},
        (err) => {}
      );
    } else {
    }
  }

  async initForm(groupForm?: datosPedidoInterface): Promise<FormGroup<any>> {
    return groupForm
      ? this.formBuilder.group(groupForm)
      : this.formBuilder.group({
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
