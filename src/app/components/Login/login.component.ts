import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
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
  pedidos!: string[];
  faXmark = faXmark;

  constructor(
    private appComponent: AppComponent,
    private renderer: Renderer2,
    private activatedRoute: ActivatedRoute,
    private usersService: UsersService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

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
          contrasena: this.contrasena,
        };

        this.usersService.getLogin(form).subscribe(
          (res) => {
            let { id } = this.activatedRoute?.snapshot?.params || undefined,
              dataUpdate;

            this.appComponent.user = res;

            // if (!id && (!this.pedidos || !this.pedidos.length)) return;

            if (res.pedido?.length) {
              res.pedido = res.pedido.filter(
                (diseño) => !this.pedidos.some((id) => id === diseño)
              );

              this.pedidos.push(...res.pedido);
            }

            if (id) {
              this.pedidos = this.pedidos.filter((_id) => _id !== id);

              dataUpdate = !this.pedidos.length ? [id] : [id, ...this.pedidos];
            } else dataUpdate = this.pedidos;

            this.usersService
              .updateUser(res._id!, dataUpdate, 'pedido')
              .subscribe(
                (userUpdate) => {
                  console.log(
                    '🚀 ~ file: login.component.ts:108 ~ LoginComponent ~ this.usersService.getLogin ~ userUpdate',
                    userUpdate
                  );
                  localStorage.setItem('userID', res._id!);
                },
                (err) =>
                  this.spinner.hide().then(() => {
                    console.error({ err });
                    Swal.fire({
                      confirmButtonColor: '#000',
                      icon: 'error',
                      html: err.error?.message ?? err.message ?? err,
                      scrollbarPadding: false,
                    });
                  }),
                () =>
                  this.appComponent.ngOnInit().then(() => {
                    this.router
                      .navigate(['/'])
                      .then(() => localStorage.removeItem('pedido'))
                      .finally(() => this.spinner.hide());
                  })
              );
          },
          (err) =>
            this.spinner.hide().then(() => {
              console.error({ err });
              Swal.fire({
                confirmButtonColor: '#000',
                icon: 'error',
                html: err.error?.message ?? err.message ?? err,
                scrollbarPadding: false,
              });
            })
        );
      })
      .catch((err) =>
        this.spinner.hide().then(() => {
          console.error({ err });
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
          contrasena: this.contrasena,
          nombres: this.nombres || '',
          apellidos: this.apellidos || '',
          email: +this.email ? undefined : this.email,
        };

        this.usersService.getSignUp(form).subscribe(
          (res) =>
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
            ),
          (err) =>
            this.spinner.hide().then(() => {
              console.error({ err });
              Swal.fire({
                confirmButtonColor: '#000',
                icon: 'error',
                html: err.error?.message ?? err.message ?? err,
              });
            }),
          () => this.spinner.hide()
        );
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

  closeSection() {
    this.router.navigate(['/']);
  }
}
