export type Order = {
    _id: string;
    user: { name: string; email: string };
    orderItems: Array<{ name: string; quantity: number; price: number }>;
    itemsPrice: number;
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
    isPaid: boolean;
    isDelivered: boolean;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    createdAt: string;
    paidAt?: string;  
    paymentMethod: string;
    
    shippingAddress: {
      fullName: string;
      address: string;
      city: string;
      postalCode: string;
      country: string;
      phone: string;
      email: string;
    };
    deliveredAt?: string; 
  };