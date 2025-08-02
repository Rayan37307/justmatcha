import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, X, Plus, Minus, ArrowLeft } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import { Button } from '../components/Button';

export default function Cart() {
  const { 
    items, 
    loading, 
    error, 
    fetchCart, 
    updateCartItem, 
    removeFromCart, 
    clearCart 
  } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const subtotal = items.reduce((sum: number, item) => sum + (item.product.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 5 : 0; // Example shipping cost
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8">Your Cart</h2>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 p-4 border rounded-lg">
              <div className="w-24 h-24 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-md mx-auto">
          <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
          <Button asChild>
            <Link to="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="lg:flex gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            {items.map((item) => (
              <div key={item.product._id} className="flex gap-4 py-4 border-b last:border-0">
                <div className="w-24 h-24 flex-shrink-0">
                  <img 
                    src={item.product.image || '/placeholder-product.jpg'} 
                    alt={item.product.name}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{item.product.name}</h3>
                    <button 
                      onClick={() => removeFromCart(item.product._id)}
                      className="text-gray-500 hover:text-red-500"
                      aria-label="Remove item"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-2">${item.product.price.toFixed(2)}</p>
                  
                  <div className="flex items-center mt-2">
                    <button 
                      onClick={() => updateCartItem(item.product._id, Math.max(1, item.quantity - 1))}
                      className="p-1 border rounded-l hover:bg-gray-100"
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 py-1 border-t border-b">
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateCartItem(item.product._id, item.quantity + 1)}
                      className="p-1 border rounded-r hover:bg-gray-100"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-medium">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Continue Shopping
            </Button>
            <Button 
              variant="ghost" 
              onClick={clearCart}
              className="text-red-500 hover:text-red-700"
            >
              Clear Cart
            </Button>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:w-1/3 mt-8 lg:mt-0">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping > 0 ? `$${shipping.toFixed(2)}` : 'Free'}</span>
              </div>
              <div className="border-t pt-3 mt-3 flex justify-between font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            
            <Button className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white">
              Proceed to Checkout
            </Button>
            
            <div className="mt-4 text-center text-sm text-gray-500">
              <p>or</p>
              <Link to="/products" className="text-green-600 hover:underline">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
