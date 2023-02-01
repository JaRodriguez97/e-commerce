import {
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppComponent } from '@app/app.component';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { datosPedidoInterface } from '@models/datosPedido.interface';
import { disenoInterface } from '@models/diseno.interface';
import { userInterface } from '@models/users.interface';
import { DisenosService } from '@service/Disenos/disenos.service';
import { UsersService } from '@service/Users/users.service';
import { DocumentData } from 'firebase/firestore';
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

  disenosPedido!: (disenoInterface | DocumentData)[];
  formBoolean: Boolean = false;
  orderForm!: FormGroup;
  faXmark = faXmark;

  constructor(
    private readonly formBuilder: FormBuilder,
    public appComponent: AppComponent,
    private disenosService: DisenosService,
    public spinner: NgxSpinnerService,
    private usersService: UsersService,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    let groupForm: datosPedidoInterface | undefined,
      pedidos: string[] = [],
      userID = localStorage.getItem('userID');

    this.disenosPedido =
      !this.disenosPedido || !this.disenosPedido.length
        ? []
        : this.disenosPedido;

    if (userID) {
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
            this.disenosService.getDiseno(_id).subscribe(
              (res) => this.disenosPedido.push(res),
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

      pedidos?.map((_id: string) =>
        this.disenosService.getDiseno(_id).subscribe(
          (res) => this.disenosPedido.push(res),
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
