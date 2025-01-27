import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IProduct,Product } from '../models/product.model';
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
  public getProductsByCode(code:string):Observable<Product>{ //devuelve observable de un producto
    let headers=new HttpHeaders().set('Content-Type','application/json');
    return this._httpClient.get<Product>(`${this.url}/products/${code}`);
  }
  public addProduct(product:IProduct):Observable<IProduct>{ //devuelve observable de productos
    let params=JSON.stringify(product);
    let headers=new HttpHeaders().set('Content-Type','application/json');
    return this._httpClient.post<IProduct>(`${this.url}/products`,params,{headers:headers});
  }
  public updateProduct(code:string,product:IProduct):Observable<IProduct>{
    let params=JSON.stringify(product);
    let headers=new HttpHeaders().set('Content-Type','application/json');
    return this._httpClient.put<IProduct>(`${this.url}/${code}`,params,{headers:headers});
  }
  public deleteProduct(code:string):Observable<IProduct>{
    return this._httpClient.delete<IProduct>(`${this.url}/${code}`);
  }
}
