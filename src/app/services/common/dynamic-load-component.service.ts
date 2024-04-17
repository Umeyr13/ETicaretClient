import { ComponentFactoryResolver, Injectable, ViewContainerRef } from '@angular/core';
import { BaseComponent } from '../../base/base.component';

@Injectable({
  providedIn: 'root'
})
export class DynamicLoadComponentService {
  //ViewContainerRef          : Dinamik olarak yüklenecek olan componenti içerisinde barındıracak container dır. (Her dinamik yükleme sürecinde önceki view'leri clear etmemiz gerekmektedir.)
  //ComponentFactory          : Compenent lerin instance larını oluşturmak için kullanılan nesnedir.
  //ComponentFactoryResolver  : Component factory nesnesini oluşturup geri döndürür. CF i resolve eder.
  //*eski yöntem - return viewContainerRef.createComponent(this.componentFactoryResolver.resolveComponentFactory(_component)); =>deprecated 
  constructor() { }
  async loadComponent(component: ComponentType, viewContainerRef: ViewContainerRef) {

    let _component: any = null;
    switch (component) {
      case ComponentType.BasketsComponent:
        _component = (await import("../../ui/components/baskets/baskets.component")).BasketsComponent;
        break;
    }
    viewContainerRef.clear();
    return viewContainerRef.createComponent(_component);
  }
}
export enum ComponentType {
  BasketsComponent
}
