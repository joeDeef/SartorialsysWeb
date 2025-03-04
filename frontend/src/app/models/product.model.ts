export interface IProduct {
  _id?: string;
  code: string;
  name: string;
  category: 'Shirt' | 'Accessory' | 'Suit' | 'Jacket' | 'Pants';
  price: number;
  inventory: IInventory[];
  available?: boolean;
  deleted?: boolean;
  images: string[];
}

export interface IInventory {
  size: '' | 'S' | 'M' | 'L' | 'XL';
  colors: IColor[];
  available?: boolean;
}

export interface IColor {
  name: string;
  amount: number;
  available?: boolean;
}