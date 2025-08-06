import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, X, Plus, Minus, ArrowLeft } from 'lucide-react';
import useCartStore from '../store/useCartStore';

export default function Cart() {
  const navigate = useNavigate();
  const {
    items,
    loading,
    error,
    fetchCart,
    updateCartItem,
    removeFromCart,
    clearCart,
  } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const subtotal = items.reduce(
    (sum: number, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal > 0 ? 5 : 0;
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
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
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
          <p className="text-gray-600 mb-6">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link
            to="/products"
            className="inline-block px-5 py-2 rounded-md border border-green-900 text-green-900 hover:bg-green-900 hover:text-white transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-green-900">Shopping Cart</h1>

      <div className="lg:flex gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow p-4 mb-4">
            {items.map((item) => (
              <div
                key={item.product._id}
                className="flex flex-col sm:flex-row gap-4 py-4 border-b last:border-0"
              >
                <div className="w-24 h-24 flex-shrink-0">
                  <img
                    src={item.product.image || '/placeholder-product.jpg'}
                    alt={item.product.name}
                    className="w-full h-full object-cover rounded"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-lg">{item.product.name}</h3>
                    <button
                      onClick={() => removeFromCart(item.product._id)}
                      className="text-gray-500 hover:text-red-500"
                      aria-label="Remove item"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <p className="text-gray-600 text-sm mb-2">
                    ${item?.product?.price?.toFixed(2)}
                  </p>

                  {/* Counter */}
                  <div className="flex items-center mt-2">
                    <button
                      onClick={() =>
                        updateCartItem(
                          item.product._id,
                          Math.max(1, item.quantity - 1)
                        )
                      }
                      className={`w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l-md hover:bg-gray-100 transition ${
                        item.quantity <= 1
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      }`}
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="w-10 h-8 flex items-center justify-center border-t border-b border-gray-300 text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateCartItem(item.product._id, item.quantity + 1)
                      }
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r-md hover:bg-gray-100 transition"
                      aria-label="Increase quantity"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>

                <div className="text-right sm:pl-4">
                  <p className="font-medium text-green-900">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-6 flex-wrap gap-4">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-4 py-2 border border-green-900 text-green-900 rounded-md hover:bg-green-900 hover:text-white transition"
            >
              <ArrowLeft size={16} />
              Continue Shopping
            </Link>

            <button
              onClick={clearCart}
              className="inline-flex items-center px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 hover:text-red-700 transition"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3 mt-10 lg:mt-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-green-900">Order Summary</h2>

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

            <Link
              to="/checkout"
              className="block w-full px-4 py-2 text-center rounded-md mt-6 bg-green-900 hover:bg-green-800 text-white font-medium transition"
            >
              Proceed to Checkout (Cash on Delivery)
            </Link>

            <div className="mt-4 text-center text-sm text-gray-500">
              <p>or</p>
              <Link to="/products" className="text-green-900 hover:underline">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
