import { Inject, Injectable, inject } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {


  constructor(@Inject("baseSignalRUrl") private baseSignalRUrl: string) {

  }
  start(hubUrl: string) {
    hubUrl = this.baseSignalRUrl + hubUrl;
    // if (!this.connection || this._connection?.state == HubConnectionState.Disconnected) {
    const builder: HubConnectionBuilder = new HubConnectionBuilder()//bizim server daki hub ile bağlantı kuracak hub ı oluşturmamızı sağlayacak

    const hubConnection: HubConnection = builder.withUrl(hubUrl)
      .withAutomaticReconnect()
      .build();

    hubConnection.start()
      .then(() => {
        console.log("Connected");

      })
      .catch(error => setTimeout(() => this.start(hubUrl), 2000));

    hubConnection.onreconnected(connectionId => console.log("Reconnected"));//eğer kopan bağlantı tekrar bağlanırsa
    hubConnection.onreconnecting(error => console.log("Reconnecting"));//kopan bağlantı tekrar bağlanmaya çalışıyor
    hubConnection.onclose(error => console.log("Close reconnection"));//Yeniden denendi ama bir türlü bağlanılamadı
    return hubConnection;
  }
  //procedureName server daki metotun ismi ne karşılık geliyor. ilgili yere gider..
  invoke(hubUrl: string, procedureName: string, message: any, successCallBack?: (value) => void, errorCallBack?: (error) => void) {
    this.start(hubUrl).invoke(procedureName, message)
      .then(successCallBack)
      .catch(errorCallBack);
  }
  //...message demek bir dizi demek C# daki params gibi
  on(hubUrl: string, procedureName: string, callBack: (...message) => void) {
    this.start(hubUrl).on(procedureName, callBack);
  }

}
