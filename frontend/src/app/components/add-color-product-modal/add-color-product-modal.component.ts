import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IColor } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-add-color-product-modal',
  templateUrl: './add-color-product-modal.component.html',
  styleUrls: ['./add-color-product-modal.component.css']
})
export class AddColorProductModalComponent {
  @Input() selectedSize: any; // Recibimos la talla seleccionada
  @Input() code: any; // Recibimos la talla seleccionada
  @Output() close = new EventEmitter<void>();
  
  availableColors = ['Negro', 'Blanco', 'Azul', 'Verde', 'Celeste', 'Rojo', 'Violeta', 'Plomo', 'Café'];
  newColors: IColor[] = []; // Para añadir nuevos colores

  constructor(private _productService: ProductService) { }

  addNewColorRow() {
    this.newColors.push({ name: '', amount: 0 } as IColor);
  }

  removeNewColor(colorIndex: number) {
    this.newColors.splice(colorIndex, 1);
  }

  onSubmit() {
    // Verificar si el color ya existe en newColors
    const uniqueColors = this.newColors.filter((color, index, self) => 
      index === self.findIndex((t) => (
        t.name === color.name
      ))
    );
  
    // Preparar los datos para enviar
    const inventoryData = {
      colors: uniqueColors.map(color => ({
        name: color.name,
        amount: color.amount
      }))
    };
  
    // Llamamos al servicio para guardar los colores nuevos
    this._productService.addColor(this.code, this.selectedSize.size, inventoryData).subscribe(
      response => {
        console.log('Inventario actualizado con éxito', response);
        this.close.emit(); // Cerrar el modal después de guardar
      },
      error => {
        console.error('Error al actualizar el inventario', error);
      }
    );
  }  

  closeModal() {
    this.close.emit(); // Cerrar el modal
  }
}
