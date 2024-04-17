import { Inject, Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpClientService {
  constructor(
    private httpClient: HttpClient,
    @Inject('baseUrl') private baseUrl: string
  ) { } //ana url app. componentden geliyor..

  //overload yapamadığımız için RequestParameters şekilde ayrı bir nesne oalrak tanımladık
  private urlOlusturucu(requestParameters: Partial<RequestParameters>): string {
    return `${requestParameters.baseUrl ? requestParameters.baseUrl : this.baseUrl
      }/${requestParameters.controller}${requestParameters.action ? `/${requestParameters.action}` : ''}`; //eğer parametrede değişiklik yaptıysak onu kullan dedik yok yapmadıysak direk yukarıdaki base url i al dedik
  } //diğer if te(?) ise eğer action varsa al yoksa boş değer yaz dedik..
  // Bu bizim uygulamanın bütün istek süreçlerinde kullanacağımız url yapılandırması.

  get<T>(
    requestParameter: Partial<RequestParameters>,
    id?: string
  ): Observable<T> /*Dönüş tipi*/ {
    // id yi sınıf dan ayrı tuttuk çünkü id her zaman lazım olan birşey değil
    let url: string = '';

    if (requestParameter.fullEndPoint) url = requestParameter.fullEndPoint;
    else url = `${this.urlOlusturucu(requestParameter)}${id ? `/${id}` : ''}${requestParameter.queryString ? `?${requestParameter.queryString}` : ""}`; // id varsa yaz yoksa ekleme dedik. queryString varsa yaz yoksa geç 
    return this.httpClient.get<T>(url, { headers: requestParameter.headers });
  }

  post<T>(requestParameter: Partial<RequestParameters>, body: Partial<T>) {
    let url: string = '';
    if (requestParameter.fullEndPoint)
      url = requestParameter.fullEndPoint;
    else
      url = `${this.urlOlusturucu(requestParameter)}${requestParameter.queryString ? `?${requestParameter.queryString}` : ""}`;

    return this.httpClient.post<T>(url, body, {
      headers: requestParameter.headers,
    });
  }

  put<T>(requestParameter: Partial<RequestParameters>, body: Partial<T>): Observable<T> {
    let url: string = "";
    if (requestParameter.fullEndPoint)
      url = requestParameter.fullEndPoint;
    else
      url = `${this.urlOlusturucu(requestParameter)}${requestParameter.queryString ? `?${requestParameter.queryString}` : ""}`;
    return this.httpClient.put<T>(url, body, { headers: requestParameter.headers });

  }


  delete<T>(requestParameter: Partial<RequestParameters>, id: string): Observable<T> {
    let url: string = "";
    if (requestParameter.fullEndPoint)
      url = requestParameter.fullEndPoint;
    else
      url = `${this.urlOlusturucu(requestParameter)}/${id}${requestParameter.queryString ? `?${requestParameter.queryString}` : ""}`;

    return this.httpClient.delete<T>(url, { headers: requestParameter.headers });

  }
}

export class RequestParameters {
  controller?: string;
  action?: string;
  queryString?: string;

  headers?: HttpHeaders;
  baseUrl?: string;
  fullEndPoint?: string;
}
