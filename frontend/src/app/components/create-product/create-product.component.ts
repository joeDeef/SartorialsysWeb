import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NewProduct, Product } from 'src/app/models/product.model';
import { ApiService } from 'src/app/services/api.service';
import { CargarService } from 'src/app/services/cargar.service';
import { Global } from 'src/app/services/global.service';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css'],
  providers: [ApiService, CargarService]
})
export class CreateProductComponent {
  private selectedFile: File | null = null;
  public titulo: string;
  public product: NewProduct;
  public productGuardado: NewProduct;
  public url: string;
  public status: string;
  public codeGuardado: string;
  public archivosParaCargar: Array<File>
  /*@ViewChild('archivoImagen') fileInput: any;*/
  @ViewChild('fileInput', { static: false }) fileInput: any;
  constructor(private _apiService: ApiService, private _cargarServicio: CargarService) {
    this.titulo = 'Guardar Producto';
    this.url = Global.url;
    this.product = new NewProduct('', '', 0, 'Camisa', 'S', 0, '', true);
    this.productGuardado = new NewProduct('', '', 0, 'Camisa', 'S', 0, '', true);
    this.status = '';
    this.codeGuardado = '';
    this.archivosParaCargar = [];
  }
  newProduct(form: NgForm) {
    console.log(this.product);
    this._apiService.addProduct(this.product).subscribe(
      response => {
        if (response.product) {
          const productoCreado = response.product;
          //Si se cargan archivos, subir la imagen asociada al producto 
          if (this.archivosParaCargar.length > 0) {
            const imagen = this.archivosParaCargar[0];
            this._apiService.uploadImage(productoCreado.code, imagen).subscribe(
              result => {
                this.productGuardado = result.product;
                this.status = 'success';
                form.reset();
                if (this.fileInput && this.fileInput.nativeElement) {
                  this.fileInput.nativeElement.value = ''; // Resetea el input de archivo
                }
              },
              error => {
                console.error('Error al subir la imagen:', error);
                this.status = 'failed';
              }
            );
          } else {
            this.productGuardado = productoCreado;
            this.status = 'success';
            form.reset();
          }
        } else {
          this.status = 'failed';
        }
      },
      error => {
        console.error('Error al guardar el producto:', error);
        this.status = 'failed';
      }
    );
  }
  imagenChangeEvent(archivoSeleccionado: any) {
    // Guardar los archivos seleccionados en la lista
    this.archivosParaCargar = <Array<File>>archivoSeleccionado.target.files;
  }
    // Función para mapear nombres de colores a códigos hexadecimales
    getColorCode(color: string): string {
      const colorMap: { [key: string]: string } = {
        Negro: '#000000',
        Blanco: '#FFFFFF',
        Azul: '#0000FF',
        Verde: '#008000',
        Celeste: '#00FFFF',
        Rojo: '#FF0000',
        Violeta: '#8A2BE2',
        Rosado: '#FFC0CB',
        Plomo: '#808080',
        Café: '#A52A2A'
      };
  
      return colorMap[color] || '#000000'; // Por defecto negro si no se encuentra el color
    }



}
