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
