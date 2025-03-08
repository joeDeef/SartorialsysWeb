import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { IColor, IInventory } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-add-size-product-modal',
  templateUrl: './add-size-product-modal.component.html',
  styleUrls: ['./add-size-product-modal.component.css']
})
export class AddSizeProductModalComponent {
  @Input() product: any = {}; // Asegurar que no sea undefined
  @Output() close = new EventEmitter<void>();

  availableColors = ['Negro', 'Blanco', 'Azul', 'Verde', 'Celeste', 'Rojo', 'Violeta', 'Plomo', 'Café'];
  isAccessory = false;
  newInventory: IInventory[] = [
    { size: '', colors: [{ name: '', amount: 0 }] }
  ];

  constructor(private _productService: ProductService) { }

  addEmptyColorRow(sizeIndex: number) {
    this.newInventory[sizeIndex].colors.push({ name: '', amount: 0 } as IColor);
  }

  removeColor(sizeIndex: number, colorIndex: number) {
    this.newInventory[sizeIndex].colors.splice(colorIndex, 1);
  }

  addNewInventory() {
    const filteredInventory: IInventory[] = this.newInventory.filter(size => size.size !== '');

    if (filteredInventory.length === 0) {
      alert("No se han añadido tallas.");
      return;
    }

    // Verifica si solo hay un elemento y envía un objeto en lugar de un array
    const inventoryPayload = filteredInventory.length === 1 ? filteredInventory[0] : { inventory: filteredInventory };

    this._productService.addSize(this.product.code, inventoryPayload)
      .subscribe(
        response => {
          alert("Talla añadida correctamente.");
          this.closeModal();
        },
        error => {
          alert("Error al añadir la talla.");
        }
      );
  }

  closeModal() {
    this.close.emit();
  }
}
