import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import { toast } from 'react-hot-toast';
import api from '../utils/axios';

interface OrderFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

const CheckoutPage = () => {
  const { items: cartItems, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [formData, setFormData] = useState<OrderFormData>({
    fullName: '', 
    email: '', 
    phone: '', 
    address: '', 
    city: '', 
    postalCode: '',
    country: 'Bangladesh' // Default value for country
  });
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const orderData = {
        orderItems: cartItems.map(item => ({
          product: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          image: item.product.image
        })),
        shippingAddress: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country
        },
        paymentMethod: 'CashOnDelivery',
        itemsPrice: calculateTotal(),
        taxPrice: 0, // Calculate tax if needed
        shippingPrice: 0, // Add shipping cost if applicable
        totalPrice: calculateTotal()
      };

      await api.post('/orders', orderData);
      clearCart();
      setOrderSuccess(true);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setIsLoading(false);
    }
  };

  if (cartItems.length === 0 && !orderSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
          <button onClick={() => navigate('/products')} className="btn-primary">
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-green-500 text-5xl mb-4">✓</div>
          <h2 className="text-xl font-bold mb-2">Order Placed!</h2>
          <p className="mb-6">We'll contact you soon for delivery.</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Delivery Information</h2>
          
          <div className="space-y-4">
            <input type="text" name="fullName" placeholder="Full Name *" required
              value={formData.fullName} onChange={handleInputChange} className="input-field" />
            
            <input type="email" name="email" placeholder="Email *" required
              value={formData.email} onChange={handleInputChange} className="input-field" />
            
            <input type="tel" name="phone" placeholder="Phone *" required
              value={formData.phone} onChange={handleInputChange} className="input-field" />
            
            <input type="text" name="address" placeholder="Address *" required
              value={formData.address} onChange={handleInputChange} className="input-field" />
            
            <div className="grid grid-cols-2 gap-4">
              <input type="text" name="city" placeholder="City *" required
                value={formData.city} onChange={handleInputChange} className="input-field" />
              
              <input type="text" name="postalCode" placeholder="Postal Code *" required
                value={formData.postalCode} onChange={handleInputChange} className="input-field" />
            </div>
            
            <input type="hidden" name="country" value="Bangladesh" />
          </div>

          <div className="mt-8 pt-6 border-t">
            <h3 className="font-medium mb-4">Order Summary</h3>
            
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.product._id} className="flex justify-between">
                  <span>{item.product.name} x {item.quantity}</span>
                  <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between font-medium text-lg">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 bg-yellow-50 p-4 text-sm text-yellow-700 rounded">
              Pay with cash upon delivery
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full mt-6">
              {isLoading ? 'Placing Order...' : 'Place Order (Cash on Delivery)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
