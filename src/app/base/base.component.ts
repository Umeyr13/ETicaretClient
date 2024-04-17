import { NgxSpinnerService } from "ngx-spinner";

export class BaseComponent {
  constructor(private spinner: NgxSpinnerService) { }

  showSpinner(SpinnerNameType: SpinnerType) {
    this.spinner.show(SpinnerNameType);
    setTimeout(() => this.hideSpinner(SpinnerNameType), 3000);
  }

  hideSpinner(SpinnerNameType: SpinnerType) {
    this.spinner.hide(SpinnerNameType);

  }


}

export enum SpinnerType {
  BallNewtonCradle = "s1",
  LineSpinFadeRoating = "s2"

}