import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../services/ui/custom-toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from '../../base/base.component';
import { _isAuthenticated } from '../../services/common/auth.service';
// npm i @auth0/angular-jwt 

export const authGuard: CanActivateFn = (route, state) => {

  const jwtHelper: JwtHelperService = inject(JwtHelperService);
  const router: Router = inject(Router);
  const toastrService: CustomToastrService = inject(CustomToastrService);
  const spinner: NgxSpinnerService = inject(NgxSpinnerService);


  //geldiğimiz (route) adres den gitmek istediğimiz adres (state) e giderken araya gir bunları yap
  spinner.show(SpinnerType.BallNewtonCradle);
  // const token: string = localStorage.getItem("accessToken");
  // //const decodeToken = jwtHelper.decodeToken(token);
  // //const expirationDate: Date = jwtHelper.getTokenExpirationDate(token);
  // let expired: boolean;
  // try {
  //   expired = jwtHelper.isTokenExpired(token);
  // } catch {
  //   expired = true;
  // }
  if (!_isAuthenticated) {
    router.navigate(["login"], { queryParams: { returnUrl: state.url } });
    toastrService.message("Oturum açmanız gerekiyor", "Yetkisiz Erişim!", {
      messageType: ToastrMessageType.Warning,
      position: ToastrPosition.TopRight
    });
  }
  spinner.hide(SpinnerType.BallNewtonCradle);
  return true;
};
