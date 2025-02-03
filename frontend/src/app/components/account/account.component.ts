import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
    selectedSection: string = 'miCuenta';  // Sección seleccionada por defecto
    user = {
      name: 'Juan',
      last_name: 'Pérez',
      email: 'juan.perez@example.com',
    };
  
    // Inicializa orders como un arreglo vacío
    orders: { id: string; status: string }[] = [];
  
    constructor() {}
  
    ngOnInit(): void {
      // Puedes cargar los pedidos aquí si es necesario
      // Ejemplo de pedidos:
      // this.orders = [{ id: '1234', status: 'Enviado' }, { id: '5678', status: 'Pendiente' }];
    }
  
    // Cambia la sección seleccionada
    selectSection(section: string) {
      this.selectedSection = section;
    }
  }
  