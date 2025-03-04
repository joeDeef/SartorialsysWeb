import { Component, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IProduct } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;

  product: IProduct = {
    code: '',
    name: '',
    category: 'Shirt',
    price: 0,
    inventory: [{ size: '', colors: [{ name: '', amount: 0 }] }],
    images: []
  };
  previewImages: string[] = [];
  selectedImages: File[] = [];
  loading: boolean = true;
  availableColors = ['Negro', 'Blanco', 'Azul', 'Verde', 'Celeste', 'Rojo', 'Violeta', 'Plomo', 'Café'];
  currentInvetory: any = null;

  constructor(
    private _route: ActivatedRoute,
    private _productService: ProductService,
    private cdr: ChangeDetectorRef // Agregado ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      const productId = params['id'];
      this._productService.getProductsByCode(productId).subscribe({
        next: (reponse) => {
          this.product = reponse.data;
          this.loading = false;
          this.cdr.detectChanges(); // Detectar cambios
        },
        error: (error) => {
          console.error('Error al cargar el producto', error);
          this.loading = false;
        },
      });
    });
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

  /** Elimina una imagen de la lista y de la previsualización */
  removeImage(index: number) {
    this.selectedImages.splice(index, 1);
    this.previewImages.splice(index, 1);
  }

  get isAccessory(): boolean {
    return this.product.category === 'Accessory';
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

  updatePrice() {
    alert("Precio Acualizado")
  }

  saveInventory(i: any) {
    alert("Invetario Acualizado")
  }

  addSize(inventory: any): void {
    this.currentInvetory = inventory;
  }

  addColor() {
    alert("Añadir Color")
  }

  removeSizeInvetory(i: any) {
    alert("Quitar Talla")
  }

  removeColorInvetory(i: any, j: any) {
    alert("Quitar Color")
  }

  añadirImagenes() {
    alert("Añadir Imagenes")
  }

  // Método para cerrar el modal
  closeModal(): void {
    this.currentInvetory = null;  // Resetea la variable para cerrar el modal
    window.location.reload();
  }
}