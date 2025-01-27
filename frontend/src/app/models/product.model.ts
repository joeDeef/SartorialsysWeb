export interface IProduct {
  message:  string;
  products: Product[];
}

export interface Product {
  _id:      string;
  code:     string;
  name:     string;
  price:    number;
  category: string;
  size:     string;
  status:   boolean;
  color:    string;
  images:   any[];
  __v:      number;
}
export class NewProduct {
  code: string;
  name: string;
  price: number;
  category: string
  size: string
  amount: number;
  color: string;
  status: boolean;

  constructor(
      code: string,
      name: string,
      price: number,
      category: 'Camisa' | 'Accesorio' | 'Terno' | 'Chaqueta' | 'Pantalón',
      size: 'S' | 'M' | 'L' | 'XL',
      amount: number,
      color: string,
      status: boolean = true
  ) {
      this.code = code;
      this.name = name;
      this.price = price;
      this.category = category;
      this.size = size;
      this.amount = amount;
      this.color = color;
      this.status = status;
  }

  // Método para validar que los datos sean correctos
  validate(): boolean {
      if (this.amount < 0) return false;
      if (!this.code || !this.name || !this.price || 
          !this.category || !this.size || !this.color) {
          return false;
      }
      return true;
  }

  // Método para actualizar el stock
  updateAmount(newAmount: number): void {
      if (newAmount >= 0) {
          this.amount = newAmount;
      } else {
          throw new Error('El monto no puede ser negativo');
      }
  }

  // Método para cambiar el estado
  toggleStatus(): void {
      this.status = !this.status;
  }
}