import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = `${Global.url}/products`;

  constructor(private http: HttpClient) {}

  getImages(productCode: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-images/${productCode}`);
  }
}
