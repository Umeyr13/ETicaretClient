import { Component, OnInit } from '@angular/core';
import { BaseComponent, SpinnerType } from '../../../base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserAuthService } from '../../../services/common/models/user-auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertifyService, MessageType, Position } from '../../../services/admin/alertify.service';
import { UserService } from '../../../services/common/models/user.service';

@Component({
  selector: 'app-update-pasword',
  templateUrl: './update-pasword.component.html',
  styleUrl: './update-pasword.component.scss'
})
export class UpdatePaswordComponent extends BaseComponent implements OnInit {

  constructor(spinner: NgxSpinnerService, private alertifyService: AlertifyService, private router: Router, private userService: UserService, private userAuthService: UserAuthService, private activatedRoute: ActivatedRoute) {
    super(spinner);

  }
  state: any;
  ngOnInit(): void {
    this.showSpinner(SpinnerType.BallNewtonCradle);
    this.activatedRoute.params.subscribe({
      next: async params => {//başarılı bir şekilde nesneyi yakalarsa bunları yap
        const userId: string = params["userId"];//linkteki değerleri aldık
        const resetToken: string = params["resetToken"];
        this.state = await this.userAuthService.verifyResetToken(resetToken, userId, () => {
          this.state = true;//burası true gelirse çalışmaları yaptırıcağız html de.
          this.hideSpinner(SpinnerType.BallNewtonCradle)
        });
      }
    });
  }
  updatePassword(password: string, passwordConfirm: string) {
    this.showSpinner(SpinnerType.BallNewtonCradle);
    if (password != passwordConfirm) {
      this.alertifyService.message("Şifreler eşleşmiyor", {
        messageType: MessageType.Error,
        position: Position.TopRight
      });
      return;
    }
    this.activatedRoute.params.subscribe({
      next: async params => {
        const userId: string = params["userId"];
        const resetToken: string = params["resetToken"];
        await this.userService.updatePassword(userId, resetToken, password, passwordConfirm, () => {
          this.alertifyService.message("Şifre başarılı bir şekilde güncellendi", {
            messageType: MessageType.Success,
            position: Position.TopRight
          })
          this.router.navigate(["/login"]);
        },
          error => {

          });
        this.hideSpinner(SpinnerType.BallNewtonCradle);
      }
    });
  }
}
