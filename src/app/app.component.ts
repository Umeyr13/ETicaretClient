import { Component, ViewChild } from '@angular/core';
import { AuthService } from './services/common/auth.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from './services/ui/custom-toastr.service';
import { Router } from '@angular/router';
import { HttpClientService } from './services/common/http-client.service';
import { DynamicLoadComponentService } from './services/common/dynamic-load-component.service';
import { DynamicLoadComponentDirective } from './directives/common/dynamic-load-component.directive';
import { ComponentType } from './services/common/dynamic-load-component.service';
declare var $: any
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  @ViewChild(DynamicLoadComponentDirective, { static: true })
  dynamicLoadComponentDirective: DynamicLoadComponentDirective;

  constructor(private dynamicLoadComponentService: DynamicLoadComponentService, public authService: AuthService, private toastrService: CustomToastrService, private router: Router, private httpClientService: HttpClientService) {

    // httpClientService.get({
    //   controller: "basket"
    // }
    // ).subscribe(data => { debugger; });

    authService.identityCheck();
  }

  singOut() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    this.authService.identityCheck();
    this.router.navigate([""]);
    this.toastrService.message("Oturum Kapatılmıştır", "Oturum Kapatıldı!", {
      messageType: ToastrMessageType.Info,
      position: ToastrPosition.TopRight
    });

  }

  loadComponent() {

    this.dynamicLoadComponentService.loadComponent(ComponentType.BasketsComponent, this.dynamicLoadComponentDirective.viewContainerRef)
  }
}
