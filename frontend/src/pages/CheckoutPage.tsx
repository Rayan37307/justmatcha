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
    country: 'Bangladesh',
  });
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const orderData = {
        orderItems: cartItems.map((item) => ({
          product: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          image: item.product.image,
        })),
        shippingAddress: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        paymentMethod: 'CashOnDelivery',
        itemsPrice: calculateTotal(),
        taxPrice: 0,
        shippingPrice: 0,
        totalPrice: calculateTotal(),
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
          <button
            onClick={() => navigate('/products')}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition"
          >
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
          <button
            onClick={() => navigate('/')}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-green-700 mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-green-600">Delivery Information</h2>

          <div className="space-y-4 mb-6">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name *"
              required
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full border border-green-300 p-3 rounded-md focus:ring-2 focus:ring-green-400 outline-none"
            />
            <input
              type="email"
              name="email"
              placeholder="Email *"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full border border-green-300 p-3 rounded-md focus:ring-2 focus:ring-green-400 outline-none"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone *"
              required
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full border border-green-300 p-3 rounded-md focus:ring-2 focus:ring-green-400 outline-none"
            />
            <input
              type="text"
              name="address"
              placeholder="Address *"
              required
              value={formData.address}
              onChange={handleInputChange}
              className="w-full border border-green-300 p-3 rounded-md focus:ring-2 focus:ring-green-400 outline-none"
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="city"
                placeholder="City *"
                required
                value={formData.city}
                onChange={handleInputChange}
                className="w-full border border-green-300 p-3 rounded-md focus:ring-2 focus:ring-green-400 outline-none"
              />
              <input
                type="text"
                name="postalCode"
                placeholder="Postal Code *"
                required
                value={formData.postalCode}
                onChange={handleInputChange}
                className="w-full border border-green-300 p-3 rounded-md focus:ring-2 focus:ring-green-400 outline-none"
              />
            </div>
            <input type="hidden" name="country" value="Bangladesh" />
          </div>

          <div className="pt-6 border-t mt-10">
            <h3 className="text-lg font-semibold mb-4 text-green-600">Order Summary</h3>

            <div className="space-y-3 mb-6">
              {cartItems.map((item) => (
                <div key={item.product._id} className="flex justify-between text-sm">
                  <span>{item.product.name} × {item.quantity}</span>
                  <span className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between font-semibold text-lg border-t pt-4">
              <span>Total</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>

            <div className="mt-4 bg-yellow-50 text-yellow-800 px-4 py-3 rounded-md text-sm">
              Pay with <strong>cash upon delivery</strong>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-md transition"
            >
              {isLoading ? 'Placing Order...' : 'Place Order (Cash on Delivery)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
