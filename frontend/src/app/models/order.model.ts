export interface Order {
    _id: string;
    status: string;
    user?: string;
    items: Array<{
      code: string;
      name: string;
      unitPrice: number;
      size: string;
      color: string;
      quantity: number;
      totalPrice: number;
    }>;
    shippingInfo: {
      fullName: string;
      address: string;
      city: string;
      postalCode: string;
    };
    paymentInfo: {
      cardName: string;
      cardNumber: string;
      expirationDate: string;
      cvv: string;
    };
    subtotal: number;
    orderTotalPrice: number;
    orderDate: string;
  }