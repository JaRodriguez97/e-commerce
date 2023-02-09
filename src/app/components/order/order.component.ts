import {
  Component,
  ElementRef,
  ChangeDetectorRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
  ChangeDetectionStrategy,
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
  changeDetection: ChangeDetectionStrategy.Default,
})
export class OrderComponent implements OnInit {
  @Input('user') user!: userInterface | undefined;
  @ViewChild('order__list') order__list!: ElementRef;
  @ViewChild('smmok') smmok!: ElementRef;

  productsPedido: Array<productInterface> = [];
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
      pedidos: Array<productInterface> = [],
      userID = localStorage.getItem('userID');

    this.productsPedido =
      !this.productsPedido || !this.productsPedido.length
        ? []
        : this.productsPedido;

    // this.appComponent.pedidos?.forEach((id) => this.getProduct(id));

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
                fechaHora: [
                  new Date(),
                  [Validators.required, Validators.minLength(5)],
                ],
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
          this.initForm(groupForm)
            .then((orderForm) => (this.orderForm = orderForm))
            .catch((err) => console.error(err))
            .finally(() => this.spinner.hide());
        }
      );
    } else {
      this.initForm(groupForm)
        .then((orderForm) => (this.orderForm = orderForm))
        .catch((err) => console.error(err))
        .finally(() => this.spinner.hide());
    }
  }

  getProduct(_id: string) {
    this.productsService.getProduct(_id).subscribe(
      (res) => this.productsPedido.push(res),
      (err) => console.error(err)
    );
  }

  getOutOrder() {
    this.renderer.removeClass(this.order__list.nativeElement, 'active');
    this.renderer.removeClass(this.smmok.nativeElement, 'active');
    this.appComponent.getOutOrder();
    this.formBoolean = false;
  }

  getFinishOrder() {
    this.ngOnInit();
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
        },
        addMlSeconds = 115 * 60000;

      if (
        new Date(pedidoFinalizado.datosPedido.fechaHora.toString()).getTime() -
          Date.now() +
          addMlSeconds <
        addMlSeconds * 2
      ) {
        Swal.fire({
          icon: 'warning',
          html: '<span>el pedido debe ser programado minimo para dentro de 2 horas</span>',
        });
        return;
      }

      this.user.pedidosRealizados || this.user.pedidosRealizados!.length
        ? this.user.pedidosRealizados!.push(pedidoFinalizado)
        : (this.user.pedidosRealizados = [pedidoFinalizado]);

      this.user.direccion =
        !this.user.direccion &&
        typeof pedidoFinalizado.datosPedido.direccion == 'string'
          ? pedidoFinalizado.datosPedido.direccion
          : this.user.direccion;

      Swal.fire({
        icon: 'warning',
        width: '70vw',
        title: 'Confirma la información de quien recibirá el pedido',
        html: `
<style>
  section {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1vh;
  }
</style>
        
<section>
  <div class="group">
    <label for="nombre">Nombre:</label
    ><strong>
      ${pedidoFinalizado.datosPedido.nombre || 'Dato no Asignado'}
    </strong>
  </div>
  <div class="group">
    <label for="apellido">Apellido:</label
    ><strong>
      ${pedidoFinalizado.datosPedido.apellido || 'Dato no Asignado'}
    </strong>
  </div>
  <div class="group">
    <label for="email">Email: </label
    ><strong>
      ${pedidoFinalizado.datosPedido.email || 'Dato no Asignado'}
    </strong>
  </div>
  <div class="group">
    <label for="fecha">Fecha: </label
    ><strong>
      ${
        pedidoFinalizado.datosPedido.fechaHora.toString().split('T').shift() ||
        'Dato no Asignado'
      }
    </strong>
  </div>
  <div class="group">
    <label for="hora">Hora aproximada de entrega: </label
    ><strong>
      ${
        pedidoFinalizado.datosPedido.fechaHora.toString().split('T').pop() ||
        'Dato no Asignado'
      }
    </strong>
  </div>
  <div class="group">
    <label for="celular">Número teléfono: </label
    ><strong>
      ${pedidoFinalizado.datosPedido.celular || 'Dato no Asignado'}
    </strong>
  </div>
  <div class="group">
    <label for="direccion">Dirección: </label
    ><strong>
      ${pedidoFinalizado.datosPedido.direccion || 'Dato no Asignado'}
    </strong>
  </div>
  <div class="group">
    <label for="detallesUbicacion">Detalles de ubicación: </label
    ><strong>
      ${pedidoFinalizado.datosPedido.detallesUbicacion || 'Dato no Asignado'}
    </strong>
  </div>
  <div class="group">
    <label for="detallesPedido">Detalles sobre el pedido: </label
    ><strong>
      ${pedidoFinalizado.datosPedido.detallesPedido || 'Dato no Asignado'}
    </strong>
  </div>
</section>`,
        showCancelButton: true,
        cancelButtonText: 'Corregir datos',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Enviar pedido',
        showConfirmButton: true,
      }).then((res) => {
        this.spinner.show().then(() => {
          if (res.isConfirmed && this.user) {
            this.user.pedido = [];
            this.usersService.sendOrder(this.user._id!, this.user).subscribe(
              (res) => {
                let ultimoPedido = res.pedidosRealizados?.pop();
                console.log(
                  '🚀 ~ file: order.component.ts:293 ~ OrderComponent ~ this.spinner.show ~ ultimoPedido',
                  res
                );
                Swal.fire({
                  icon: 'success',
                  title: 'Pedido enviado',
                  text: 'en unos instantes te llegará un mensaje al correo electrónico sobre la confirmación del pedido',
                }).then(() =>
                  this.router.navigate([
                    'seguimientoPedido/',
                    ultimoPedido?._id,
                  ])
                );
              },
              (err) => console.error(err),
              () => this.spinner.hide()
            );
          } else this.spinner.hide();
        });
      });
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
