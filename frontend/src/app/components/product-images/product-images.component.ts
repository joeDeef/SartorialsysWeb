import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ProductService } from 'src/app/services/product.service'; // Importa tu servicio

@Component({
  selector: 'app-product-images',
  templateUrl: './product-images.component.html',
  styleUrls: ['./product-images.component.css']
})
export class ProductImagesComponent {
  @Input() currentImages: string[] = []; // Imágenes actuales del producto
  @Input() productCode: string = ''; // Código del producto (pasado desde el componente padre)
  @Output() imagesToDelete = new EventEmitter<string[]>(); // Imágenes a eliminar
  @Output() newImages = new EventEmitter<File[]>(); // Nuevas imágenes cargadas

  imagesToDeleteList: string[] = []; // Lista de imágenes a eliminar
  newImagesList: File[] = []; // Lista de nuevas imágenes seleccionadas
  newImagePreviews: string[] = []; // Previsualización de nuevas imágenes

  constructor(private _productService: ProductService) { }

  // Método para añadir imágenes a la lista de nuevas imágenes
  onImagesSelected(event: any): void {
    const files: File[] = event.target.files;

    if (files) {
      // Limpiar la lista de previsualización
      this.newImagePreviews = [];
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = () => {
          this.newImagePreviews.push(reader.result as string); // Guardar la previsualización en base64
        };
        reader.readAsDataURL(files[i]); // Leer la imagen como URL base64
      }

      // Añadir las nuevas imágenes a la lista
      this.newImagesList.push(...files);
      this.newImages.emit(this.newImagesList); // Emitir las nuevas imágenes al componente padre
    }
  }

  // Método para eliminar la imagen y enviarla al backend
  deleteImage(imageName: string): void {
    this._productService.deleteImages(this.productCode, imageName).subscribe(
      (response) => {
        console.log('Imagen eliminada exitosamente:', response);
        alert('Imagen eliminada correctamente.');

        // Si la eliminación es exitosa, eliminar la imagen de la lista de imágenes actuales
        this.currentImages = this.currentImages.filter(img => img !== imageName);
      },
      (error) => {
        console.error('Error al eliminar la imagen:', error);
        alert('Hubo un error al eliminar la imagen.');
      }
    );
  }

  // Método para subir nuevas imágenes al servidor
  uploadNewImages(): void {
    if (this.newImagesList.length === 0) {
      alert('No has seleccionado ninguna imagen para cargar.');
      return;
    }

    const formData = new FormData();
    for (const file of this.newImagesList) {
      formData.append('image', file, file.name);
    }

    // Llamamos al servicio para cargar las imágenes usando el productCode
    this._productService.uploadImages(this.productCode, formData).subscribe(
      (response) => {
        console.log('Imágenes cargadas exitosamente:', response);
        alert('Imágenes cargadas correctamente.');
        window.location.reload();
      },
      (error) => {
        console.error('Error al cargar las imágenes:', error);
        alert('Hubo un error al cargar las imágenes.');
      }
    );
  }
}
