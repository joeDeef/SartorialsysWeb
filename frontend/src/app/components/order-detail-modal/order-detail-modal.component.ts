import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-order-detail-modal',
  templateUrl: './order-detail-modal.component.html',
  styleUrls: ['./order-detail-modal.component.css']
})
export class OrderDetailModalComponent {
  @Input() order: any;
  @Output() close = new EventEmitter<void>();

  // Método para cerrar el modal
  closeModal() {
    this.close.emit();
  }
}
