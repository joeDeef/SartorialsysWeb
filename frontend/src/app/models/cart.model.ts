import { Product } from './product.model';

export interface CartItem {
  product: Product; // Usando el modelo Product existente
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalPrice: number;
}
