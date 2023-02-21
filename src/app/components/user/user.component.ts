import { userInterface } from '@models/users.interface';
import {
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { AppComponent } from '@app/app.component';
import {
  faAddressCard,
  faFileInvoiceDollar,
  faCircleInfo,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  @ViewChild('smmok') smmok!: ElementRef;
  @ViewChild('user__list') user__list!: ElementRef;
  @ViewChild('profile') profile!: ElementRef;
  
  faAddressCard = faAddressCard;
  faFileInvoiceDollar = faFileInvoiceDollar;
  faCircleInfo = faCircleInfo;
  faXmark = faXmark;

  constructor(public appComponent: AppComponent, private renderer: Renderer2) {}

  ngOnInit(): void {}

  getOutUser() {
    this.appComponent.getOutUser();
    this.renderer.removeClass(this.user__list.nativeElement, 'active');
    this.renderer.removeClass(this.smmok.nativeElement, 'active');
    this.renderer.removeClass(this.profile.nativeElement, 'active');
  }

  getProfile() {
    this.appComponent.getOutSections();
    this.renderer.addClass(this.user__list.nativeElement, 'active');
    this.renderer.addClass(this.smmok.nativeElement, 'active');
    this.renderer.addClass(this.profile.nativeElement, 'active');
  }

  getOrdersFinishing() {}

  getHelp() {}
}
