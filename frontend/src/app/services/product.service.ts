import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IColor, IInventory, IProduct } from '../models/product.model';
import { Global } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  apiUrl: string;
  constructor(private _httpClient: HttpClient) {
    this.apiUrl = `${Global.url}/products`;
  }

  getProducts(category?: string): Observable<{ data: IProduct[] }> {
    let url = `${this.apiUrl}`;
    if (category) {
      url += `?category=${category}`;
    }
    return this._httpClient.get<{ data: IProduct[] }>(url);
  }

  //Añadir un nuevo producto
  public addProduct(product: IProduct): Observable<any> {
    let params = JSON.stringify(product);
    return this._httpClient.post<any>(`${this.apiUrl}`, params, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Servicio en Angular para subir múltiples imágenes
  public uploadImages(productCode: string, formData: FormData): Observable<any> {
    return this._httpClient.post<any>(`${this.apiUrl}/upload-images/${productCode}`, formData, {
      headers: {
      }
    });
  }

  //ver Product por Id
  public getProductsByCode(code: string): Observable<any> { //devuelve observable de un producto
    return this._httpClient.get<any>(`${this.apiUrl}/${code}`);
  }

  //actualizar un nuevo producto 
  public updateProduct(code: string, product: any): Observable<any> {
    let params = JSON.stringify(product);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._httpClient.put<any>(`${this.apiUrl}/${code}`, params, { headers: headers });
  }
  
  public deleteProduct(code: string): Observable<any> {
    return this._httpClient.delete<any>(`${this.apiUrl}/${code}`);
  }

  public updateInventory(code: string, inventory: any) {
    return ""
  }

  public addSize(code: string, inventory: IInventory | { inventory: IInventory[] }): Observable<any> {
    return this._httpClient.post<any>(`${this.apiUrl}/${code}/add-size`, inventory);
  }

  public addColor(code: string, size: string, inventoryData: { colors: IColor[] }) {
    return this._httpClient.post(`${this.apiUrl}/${code}/${size}/add-color`, inventoryData);
  }

  public removeSize(code: string, size: string): Observable<any> {
    return this._httpClient.delete<any>(`${this.apiUrl}/${code}/${size}/remove`);
  }

  public removeColor(code: string, size: string, color: string) {
    return this._httpClient.delete(`${this.apiUrl}/${code}/${size}/${color}/remove`);
  }
}
