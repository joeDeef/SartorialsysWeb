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
  addToCart(cartId: string, productCode: string, quantity: number): Observable<any> {
    return this._http.post<any>(`${this.url}/${cartId}`, {
      productCode,
      quantity,
    });
  }

  updateQuantity(cartId: string, productCode: string, newQuantity: number): Observable<any> {
    return this._http.put<any>(`${this.url}/${cartId}?productCode=${productCode}`, {
      newQuantity,
    });
  }

  removeFromCart(cartId: string, productCode: string): Observable<any> {
    return this._http.delete<any>(`${this.url}/${cartId}?productCode=${productCode}`);
  }
}
