import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IProduct,NewProduct,Product } from '../models/product.model';
import { Global } from './global.service';

@Injectable()
export class ApiService {
  url:string;
  constructor(private _httpClient:HttpClient) 
  {
    this.url=Global.url;
   }
   //ver
  public getProducts():Observable<IProduct>{ //devuelve observable de productos
    return this._httpClient.get<IProduct>(`${this.url}/products`);
  }
  //ver libro por id 
  public getProductsByCode(code:string):Observable<any>{ //devuelve observable de un producto
    let headers=new HttpHeaders().set('Content-Type','application/json');
    return this._httpClient.get<any>(`${this.url}/products/${code}`);
  }
  //anadir un nuevo producto
  public addProduct(product:NewProduct):Observable<any>{ //devuelve observable de productos
    let params=JSON.stringify(product);
    let headers=new HttpHeaders().set('Content-Type','application/json');
    return this._httpClient.post<any>(`${this.url}/products`,params,{headers:headers});
  }
  //actualizar la imagen de un producto
  public uploadImage(productId: string, file: File): Observable<any> {
    const formData = new FormData(); // Creamos el formulario
    formData.append('image', file); // Añadimos el archivo bajo la clave "image"
  
    return this._httpClient.post<any>(`${this.url}/products/upload-images/${productId}`, formData);
  }
  //actualizar un nuevo producto 
  public updateProduct(code:string,product:Product):Observable<any>{
    let params=JSON.stringify(product);
    let headers=new HttpHeaders().set('Content-Type','application/json');
    return this._httpClient.put<any>(`${this.url}/products/${code}`,params,{headers:headers});
  }
  public deleteProduct(code:string):Observable<any>{
    return this._httpClient.delete<any>(`${this.url}/products/${code}`);
  }

}
