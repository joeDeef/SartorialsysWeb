import { Component, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IInventory, IProduct } from 'src/app/models/product.model';
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
  loading: boolean = true;
  availableColors = ['Negro', 'Blanco', 'Azul', 'Verde', 'Celeste', 'Rojo', 'Violeta', 'Plomo', 'Café'];
  currentInvetory: any = null;
  currentSize: any = null;

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

  get isAccessory(): boolean {
    return this.product.category === 'Accessory';
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

  addColor(selectedSize: IInventory) {
    this.currentSize = selectedSize;
  }

  // Método para eliminar una talla del inventario
  removeSizeInvetory(sizeIndex: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta talla del inventario?')) {
      const size = this.product.inventory[sizeIndex];
      this.product.inventory.splice(sizeIndex, 1);

      this._productService.removeSize(this.product.code, size.size)
        .subscribe(
          response => {
            console.log('Talla eliminada exitosamente:', response);
            window.location.reload();
          },
          error => {
            console.error('Error al eliminar la talla:', error);
          }
        );
    }
  }

  removeColorInvetory(sizeIndex: number, colorIndex: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este color del inventario?')) {
      // Obtener la talla y el color que se eliminarán
      const size = this.product.inventory[sizeIndex];
      const color = size.colors[colorIndex];

      size.colors.splice(colorIndex, 1);

      this._productService.removeColor(this.product.code, size.size, color.name)
        .subscribe(
          response => {
            console.log('Color eliminado exitosamente:', response);
          },
          error => {
            console.error('Error al eliminar el color:', error);
          }
        );
    }
  }

  // Método para cerrar el modal
  closeModalSize(): void {
    this.currentInvetory = null;
    window.location.reload();
  }

  closeModalColor(): void {
    this.currentInvetory = null;
    window.location.reload();
  }

  añadirImagenes() {
    alert("Añadir Imagenes")
  }
}