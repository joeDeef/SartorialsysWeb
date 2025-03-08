import { IProduct } from './product.model';

export interface CartItem {
  product: IProduct; // Usando el modelo Product existente
  quantity: number;
  color: string,
  size: string
}

export interface Cart {
  items: CartItem[];
  totalPrice: number;
}
