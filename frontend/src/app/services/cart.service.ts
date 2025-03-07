import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Global } from './global.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private url = `${Global.url}/cart`;

  constructor(private _http: HttpClient) {
  }

  // ver carrito
  getCart(cartId: string): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get<any>(`${this.url}/${cartId}`, {
      headers: headers,
    });
  }

  // agregar items al carrito
  addToCart(cartId: string, product: any): Observable<any> {
    return this._http.post<any>(`${this.url}/${cartId}`, product);
  }
  

  updateQuantity(cartId: string, itemData: any): Observable<any> {
    return this._http.patch<any>(`${this.url}/${cartId}`, itemData);
  }

  removeFromCart(cartId: string, itemData: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.delete<any>(`${this.url}/${cartId}`, {
      headers: headers,
      body: itemData,  // Aquí es donde se incluye el cuerpo
    });
  }
  
}
