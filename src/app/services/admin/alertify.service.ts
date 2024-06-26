import { Injectable } from '@angular/core';
declare var alertify: any;
@Injectable({
  providedIn: 'root'
})
export class AlertifyService {

  constructor() { }
  // message(message: string, messageType: MessageType, position: Position, delay: number = 3, dismissOthers: boolean = false) {
  message(message: string, options: Partial<AlertifyOptions>) {//Patial olarak tanımladığımız için artık kullandığımız yerde direk süslü parantez için de oluşturabiliriz nesne örneği almadan {numbr =10,..}

    alertify.set('notifier', 'delay', options.delay);
    alertify.set('notifier', 'position', options.position);
    const msj = alertify[options.messageType](message);
    if (options.dismissOther)
      msj.dismissOthers();
  }

  dismiss() {
    alertify.dismissAll();
  }

}

export class AlertifyOptions {
  messageType: MessageType = MessageType.Message;
  position: Position = Position.TopLeft;
  delay: number = 4;
  dismissOther: boolean = false;
}
export enum MessageType {
  Error = "error",
  Message = "message",
  Notify = "notify",
  Success = "success",
  Warning = "warning"
}

export enum Position {
  TopCenter = "top-center",
  TopRight = "top-right",
  TopLeft = "top-left",
  BottomRight = "bottom-right",
  BottomCenter = "bottom-center",
  BottomLeft = "bottom-left"
}