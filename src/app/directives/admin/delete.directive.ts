import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent, DeleteState } from '../../dialogs/delete-dialog/delete-dialog.component';
import { HttpClientService } from '../../services/common/http-client.service';
import { AlertifyService, MessageType, Position } from '../../services/admin/alertify.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogService } from '../../services/common/dialog.service';

declare var $: any;
@Directive({
  selector: '[appDelete]'
})
export class DeleteDirective {

  constructor(private element: ElementRef,
    private _renderer: Renderer2,
    private httpClientService: HttpClientService,
    public dialog: MatDialog,
    private alertifyService: AlertifyService,
    private dialogService: DialogService
  ) {

    const img: HTMLElement = _renderer.createElement("img");
    img.setAttribute("src", "../../../../../assets/close_1828665.png");
    img.setAttribute("style", "cursor: pointer;");
    img.setAttribute("width", "20");
    img.setAttribute("height", "20");
    _renderer.appendChild(element.nativeElement, img);
  }

  @Input() id: string;
  @Input() controller: string;
  @Output() callback: EventEmitter<any> = new EventEmitter  //İsmi önemli aynı ismi verdik html deki. 
  @HostListener("click")//buraya verdiğimiz şey aşağıda gerçekleşir

  async onclick() {
    this.dialogService.openDialog({
      componentType: DeleteDialogComponent,
      data: DeleteState.Yes,
      afterClosed: async () => { //eğer dönen sonuç 'Yes' ise bu fonksiyon tetiklenecek.
        const td: HTMLTableCellElement = this.element.nativeElement;
        //await this.productService.delete(this.id);
        this.httpClientService.delete({
          controller: this.controller
        }, this.id).subscribe(data => {
          $(() => {
            this.callback.emit(), this.alertifyService.message("Ürün başarıyla silinmiştir", {
              dismissOther: true,
              messageType: MessageType.Success,
              position: Position.TopRight
            })
          })// this.callback.emit();//animasyon bitince bunu tetikle dedik. Bu fonksiyon tabloyu refreş ediyor

          $(td.parentElement).animate({
            opacity: 0,
            left: "+=50",
            height: "toggle"
          }, 700);
        }, (errorResponse: HttpErrorResponse) => this.alertifyService.message("Ürün Silinemedi", {
          dismissOther: true,
          messageType: MessageType.Error,
          position: Position.TopRight
        }
        ));
        //.fadeOut(1000 //,() => { bu şekilde de kullanımı var
        //this.callback.emit()
        // }
      }
    });
  }

  // openDialog(afterClosed: any): void {
  //   const dialogRef = this.dialog.open(DeleteDialogComponent, {
  //     data: DeleteState.Yes
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result == DeleteState.Yes) {
  //       afterClosed();
  //     }
  //   });
  // }

}

