import { Component, OnInit, Renderer2 } from '@angular/core';
import { userInterface } from '@models/users.interface';
import { UsersService } from '@service/Users/users.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user!: userInterface;
  content!: Boolean;

  constructor(
    private spinner: NgxSpinnerService,
    private usersService: UsersService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    let idUser = localStorage.getItem('userID')!;
    this.content = true;

    if (idUser)
      this.usersService.getUser(idUser).subscribe(
        (res) => (this.user = res),
        (err) => console.error(err)
      );
  }

  updateStatusSection() {
    this.content = !this.content;
  }

  updateUser() {
    Swal.fire({
      icon: 'question',
      title: 'Deseas guardar los cambios?',
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Sí',
    }).then((response) =>
      response.isConfirmed
        ? this.spinner.show().then(() =>
            this.usersService.updateUser(this.user._id!, this.user).subscribe(
              (res) => {
                Swal.fire({
                  icon: 'success',
                  title: `Usuari@ ${this.user.nombres} ha sido actualizad@`,
                }).then(() => this.ngOnInit());
              },
              (err) => console.error(err),
              () => this.spinner.hide()
            )
          )
        : null
    );
  }

  previewImage(event: any) {
    console.log(event);
  }
}
