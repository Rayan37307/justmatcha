export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isNew?: boolean;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}
