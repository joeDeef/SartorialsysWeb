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
        next: (response) => {
          this.product = response.data;
  
          // Aseguramos que product.images siempre sea un arreglo
          if (!this.product.images) {
            this.product.images = []; // Si es undefined, asignamos un arreglo vacío
          }
  
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
    if (this.product.price < 0) {
      alert('El precio debe ser un número mayor o igual a 0');
      return;
    }

    this._productService.updatePrice(this.product.code, this.product.price)
      .subscribe(
        (response) => {
          console.log('Precio actualizado exitosamente:', response);
          alert('Precio actualizado correctamente');
        },
        (error) => {
          console.error('Error al actualizar el precio:', error);
          alert('Error al actualizar el precio');
        }
      );
  }

  saveInventory(): void {
    // Construir la estructura de inventario
    const inventory = this.product.inventory.map(size => ({
      size: size.size,
      colors: size.colors.map(color => ({
        name: color.name,
        amount: color.amount
      }))
    }));

    // Llamar al servicio para actualizar el inventario
    this._productService.updateInventory(this.product.code, inventory).subscribe(
      response => {
        console.log('Inventario actualizado correctamente:', response);
        alert('Inventario actualizado correctamente');
      },
      error => {
        console.error('Error al actualizar el inventario:', error);
        alert('Error al actualizar el inventario');
      }
    );
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
}