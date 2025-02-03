import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global.service';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = `${Global.url}/order`;

  constructor(private http: HttpClient) { }

  // Método para obtener pedidos del usuario
  getOrders(userId: string): Observable<{ message: string, orders: Order[] }> {
    return this.http.get<{ message: string, orders: Order[] }>(`${this.apiUrl}/${userId}`);
  }

  processOrder(cartId: any,order: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${cartId}`, order);
  }
}