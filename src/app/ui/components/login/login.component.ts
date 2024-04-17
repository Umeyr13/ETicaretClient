import { Component } from '@angular/core';
import { UserService } from '../../../services/common/models/user.service';
import { BaseComponent, SpinnerType } from '../../../base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../../services/common/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FacebookLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { HttpClientService } from '../../../services/common/http-client.service';
import { TokenResponse } from '../../../contracts/Token/TokenResponse';
import { UserAuthService } from '../../../services/common/models/user-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent extends BaseComponent {
  constructor(private userAuthService: UserAuthService, spinner: NgxSpinnerService, private authService: AuthService, private activatedRoute: ActivatedRoute, private router: Router, private socialAuthService: SocialAuthService, private httpClientService: HttpClientService) {
    super(spinner)

    socialAuthService.authState.subscribe(async (user: SocialUser) => {

      console.log(user);

      this.showSpinner(SpinnerType.BallNewtonCradle);
      switch (user.provider) {
        case "GOOGLE":
          await userAuthService.googleLogin(user, () => {
            authService.identityCheck();
            this.hideSpinner(SpinnerType.BallNewtonCradle);
          });
          break;

        case "DevreDışıFACEBOOK":
          await userAuthService.facebookLogin(user, () => {
            authService.identityCheck();
            this.hideSpinner(SpinnerType.BallNewtonCradle);
          });
          break;
      }

    });

  }
  //bir tıklamada birden fazla giriş yapmış gibi bildirim çıkma hatasını bu şekil çözdüm ama hatayı hala bulamadım.(bakılacak)
  async ExLogin() {
    this.socialAuthService.authState.subscribe(async (user: SocialUser) => {
      console.log(user);

      this.showSpinner(SpinnerType.BallNewtonCradle);
      switch (user.provider) {

        case "FACEBOOK":
          await this.userAuthService.facebookLogin(user, () => {
            this.authService.identityCheck();
            this.hideSpinner(SpinnerType.BallNewtonCradle);
          });
          break;
      }

    });
  }

  async login(UsernameOrEmail: string, Password: string) {

    this.showSpinner(SpinnerType.BallNewtonCradle);
    await this.userAuthService.login(UsernameOrEmail, Password, () => {
      this.authService.identityCheck();
      this.activatedRoute.queryParams.subscribe(params => {
        const returnUrl: string = params["returnUrl"];
        if (returnUrl)
          this.router.navigate([returnUrl]);
      });
      this.hideSpinner(SpinnerType.BallNewtonCradle);
    });
  }

  facebookLogin() {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
    this.ExLogin();
  }
}
