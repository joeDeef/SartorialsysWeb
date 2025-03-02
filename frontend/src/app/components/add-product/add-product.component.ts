import { Component, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { IProduct } from '../../models/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;

  product: IProduct;
  titulo = 'Agregar Producto';
  previewImages: string[] = [];
  selectedImages: File[] = [];
  status: 'success' | 'failed' | null = null;
  availableColors = ['Negro', 'Blanco', 'Azul', 'Verde', 'Celeste', 'Rojo', 'Violeta', 'Plomo', 'Café'];

  constructor(private cdr: ChangeDetectorRef, private _productService: ProductService) {
    this.product = this.initializeProduct();
  }

  ngOnInit() {
    if (this.product.inventory.length === 0) {
      this.addEmptySizeRow();
    }
  }

  /** Inicializa la estructura base del producto */
  private initializeProduct(): IProduct {
    return {
      code: '',
      name: '',
      category: 'Shirt',
      price: 0,
      inventory: [],
      images: [],
      available: true,
      deleted: false
    };
  }

  /** Agrega una nueva talla con un color vacío */
  addEmptySizeRow() {
    this.product.inventory.push({ size: '', colors: [{ name: '', amount: 0 }] });
    this.cdr.detectChanges();
  }

  /** Agrega un nuevo color a una talla específica */
  addEmptyColorRow(sizeIndex: number) {
    this.product.inventory[sizeIndex].colors.push({ name: '', amount: 0 });
    this.cdr.detectChanges();
  }

  /** Elimina una talla, asegurando que al menos una esté presente */
  removeSize(index: number) {
    this.product.inventory.splice(index, 1);
    if (this.product.inventory.length === 0) {
      this.addEmptySizeRow();
    }
  }

  /** Elimina un color, asegurando que al menos uno esté presente en cada talla */
  removeColor(sizeIndex: number, colorIndex: number) {
    this.product.inventory[sizeIndex].colors.splice(colorIndex, 1);
    if (this.product.inventory[sizeIndex].colors.length === 0) {
      this.product.inventory[sizeIndex].colors.push({ name: '', amount: 0 });
    }
  }

  /** Abre el selector de archivos */
  openFileInput() {
    this.fileInput.nativeElement.click();
  }

  /** Maneja la carga y previsualización de imágenes */
  onImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const files: File[] = Array.from(input.files);
    files.forEach(file => {
      this.selectedImages.push(file);
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          this.previewImages.push(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    });

    // Resetea el input para permitir seleccionar las mismas imágenes nuevamente
    input.value = '';
  }

  /** Elimina una imagen de la lista y de la previsualización */
  removeImage(index: number) {
    this.selectedImages.splice(index, 1);
    this.previewImages.splice(index, 1);
  }

  /** Envía el formulario y muestra el estado del producto */
  newProduct(form: any) {
    if (form.valid) {
      this._productService.addProduct(this.product).subscribe(
        response => {
          if (response.data) {
            const productoCreado = response.data;
            // Si hay imágenes seleccionadas, subir la primera imagen asociada al producto
            if (this.selectedImages.length > 0) {
              const formData = new FormData();
              this.selectedImages.forEach((imagen) => {
                formData.append('image', imagen, imagen.name);
              });
            
              this._productService.uploadImages(productoCreado.code, formData).subscribe(
                result => {
                  this.status = 'success';
                  form.reset();
                  this.selectedImages = [];
                  this.previewImages = [];
            
                  if (this.fileInput && this.fileInput.nativeElement) {
                    this.fileInput.nativeElement.value = ''; // Resetea el input de archivo
                  }
                },
                error => {
                  console.error('Error al subir las imágenes:', error);
                  this.status = 'failed';
                }
              );
            } else {
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
  }

  get isAccessory(): boolean {
    return this.product.category === 'Accessory';
  }
}