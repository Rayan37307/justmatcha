import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, ArrowRight } from 'lucide-react';
import useWishlistStore from '../store/useWishlistStore';
import type { WishlistItem } from '../store/useWishlistStore';
import useCartStore from '../store/useCartStore';
import { toast } from 'react-hot-toast';

const Wishlist = () => {
  const { items, loading, error, fetchWishlist, removeFromWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart(productId, 1);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await removeFromWishlist(productId);
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove from wishlist');
    }
  };

  // Ensure we have valid wishlist items with products
  const validItems = (items || []).filter((item: WishlistItem) => item?.product);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchWishlist}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (validItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Your wishlist is empty</h3>
          <p className="mt-1 text-gray-500">Start adding some products to your wishlist.</p>
          <div className="mt-6">
            <Link
              to="/products"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Browse Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Your Wishlist</h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {validItems.map((item) => (
            <div key={item._id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="relative pb-[100%] bg-gray-100">
                <img
                  src={item.product?.image || '/product.png'}
                  alt={item.product?.name || 'Product'}
                  className="absolute h-full w-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/product.png';
                    target.onerror = null; // Prevent infinite loop if fallback fails
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                  <Link to={`/products/${item.product?._id || '#'}`} className="hover:text-green-600">
                    {item.product?.name || 'Product Name'}
                  </Link>
                </h3>
                <p className="text-sm font-medium text-gray-900 mb-3">
                  ${item.product?.price?.toFixed(2) || '0.00'}
                </p>
                <div className="flex justify-between">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFromWishlist(item._id);
                    }}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Remove
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (item.product?._id) {
                        handleAddToCart(item.product._id);
                      }
                    }}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700"
                    disabled={!item.product?._id}
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
