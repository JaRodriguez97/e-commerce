import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { pedidoInterface } from '@models/pedido.interface';
import { UsersService } from '@service/Users/users.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  @ViewChild('formBx') formBx!: ElementRef;
  @ViewChild('body') body!: ElementRef;
  telefono!: Number;
  contrasena!: string;
  repiteContrasena!: String;
  nombres!: string;
  apellidos!: string;
  email!: string;
  idCombo!: string;
  pedidos!: pedidoInterface[];

  constructor(
    private appComponent: AppComponent,
    private renderer: Renderer2,
    private activatedRoute: ActivatedRoute,
    private usersService: UsersService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
    // appComponent.ngOnInit().then(() => {});
  }

  ngOnInit(): void {
    this.spinner
      .show()
      .then(() => {
        this.appComponent.paragraphSpinner = 'Cargando...';

        if (localStorage.getItem('userID')) this.router.navigate(['/']);

        this.pedidos = localStorage.getItem('pedido')
          ? JSON.parse(localStorage.getItem('pedido')!)
          : [];
      })
      .catch((err) => console.error(err))
      .finally(() => this.spinner.hide());
  }

  signInBtn() {
    this.renderer.removeClass(this.formBx.nativeElement, 'active');
    this.renderer.removeClass(this.body.nativeElement, 'active');
  }

  signUpBtn() {
    this.renderer.addClass(this.formBx.nativeElement, 'active');
    this.renderer.addClass(this.body.nativeElement, 'active');
  }

  checkLogin() {
    this.spinner
      .show()
      .then(() => {
        if (!this.telefono) throw new Error('Diligenciar campo telefono');
        else if (!this.contrasena)
          throw new Error('Diligenciar campo contraseña');

        let form = {
          numeroTelefono: this.telefono,
          contraseña: this.contrasena,
        };

        this.usersService
          .getLogin(form)
          .then((res) => {
            let { id } = this.activatedRoute?.snapshot?.params || undefined,
              dataUpdate;

            this.appComponent.user = res;

            if (res.pedido?.length) {
              res.pedido = res.pedido.filter(
                (diseño) =>
                  !this.pedidos.some((pedido) => pedido._id === diseño._id)
              );

              this.pedidos.push(...res.pedido);
            }

            if (id) {
              this.pedidos = this.pedidos.filter((pedido) => pedido._id !== id);

              if (!this.pedidos.length)
                dataUpdate = { pedido: [{ _id: id, cantidad: 1 }] };
              else
                dataUpdate = {
                  pedido: [{ _id: id, cantidad: 1 }, ...this.pedidos],
                };
            } else dataUpdate = { pedido: this.pedidos };

            this.usersService.updateUser(res._id!, dataUpdate, 'usuarios');

            this.router
              .navigate(['/'])
              .then(() => localStorage.setItem('userID', res?._id!))
              .then(() => localStorage.removeItem('pedido'));
          })
          .catch((err) =>
            this.spinner.hide().then(() => {
              console.error({ err });
              Swal.fire({
                confirmButtonColor: '#000',
                icon: 'error',
                html: err.error?.message ?? err.message ?? err,
              });
            })
          )
          .finally(() => this.spinner.hide());
      })
      .catch((err) =>
        this.spinner.hide().then(() => {
          console.error(err);
          Swal.fire({
            confirmButtonColor: '#000',
            icon: 'error',
            html: err,
          });
        })
      );
  }

  checkSignUp() {
    this.spinner
      .show()
      .then(() => {
        if (!this.telefono) throw new Error('Diligenciar campo telefono');
        else if (!this.contrasena)
          throw new Error('Diligenciar campo contraseña');
        else if (!this.repiteContrasena)
          throw new Error('Diligenciar nuevamente la contraseña');
        else if (this.repiteContrasena !== this.contrasena)
          throw new Error('Las contraseñas no coinciden');

        let form = {
          numeroTelefono: this.telefono,
          contraseña: btoa(this.contrasena),
          nombres: this.nombres || '',
          apellidos: this.apellidos || '',
          email: this.email || '',
        };

        this.usersService
          .getSignUp(form)
          .then((res) =>
            this.spinner.hide().then(() =>
              Swal.fire({
                icon: 'success',
                imageWidth: 100,
                confirmButtonColor: '#000',
                html: `<b>Te damos la bienvenida ${
                  res!.nombres || res!.numeroTelefono
                }, por favor ingresa con los mismos datos para que no los olvides.</b>`,
              }).then(() =>
                this.spinner
                  .show()
                  .then(() => this.appComponent.reloadTo('login'))
                  .then(() => setTimeout(() => this.spinner.hide(), 500))
              )
            )
          )
          .then(() => this.spinner.hide())
          .catch((err) =>
            this.spinner.hide().then(() => {
              console.error({ err });
              Swal.fire({
                confirmButtonColor: '#000',
                icon: 'error',
                html: err.error?.message ?? err.message ?? err,
              });
            })
          )
          .then(() => this.spinner.hide());
      })
      .catch((err) =>
        this.spinner.hide().then(() => {
          console.error({ err });
          Swal.fire({
            confirmButtonColor: '#000',
            icon: 'error',
            html: err.error?.message ?? err.message ?? err,
          });
        })
      );
  }
}
