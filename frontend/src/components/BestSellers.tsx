import { Eye, Heart, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import useProductsStore from "../store/useProductsStore";
import useCartStore from "../store/useCartStore";
import useAuthStore from "../store/useAuthStore";
import { toast } from "react-hot-toast";

const icons = [Heart, Eye];

const BestSellers = () => {
  const { products, loading, error, fetchProducts } = useProductsStore();
  const { addToCart, loading: cartLoading } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (loading) {
    return (
      <section className="py-16">
        <h2 className="text-green-900 text-3xl font-bold mb-10">Best Sellers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-full max-w-[270px] bg-white rounded-md overflow-hidden animate-pulse">
              <div className="w-full h-[270px] bg-gray-200"></div>
              <div className="p-4">
                <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-5 bg-gray-200 rounded w-1/3 mx-auto"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16">
        <h2 className="text-green-900 text-3xl font-bold mb-4">Best Sellers</h2>
        <p className="text-red-500">Error loading products: {error}</p>
      </section>
    );
  }

  return (
    <section className="py-16">
      <h2 className="text-green-900 text-3xl font-bold mb-10">Best Sellers</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
        {products.map((product) => (
          <div key={product._id} className="relative w-full max-w-[270px] bg-white rounded-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-[270px] object-cover hover:scale-105 transition-transform duration-300" 
                onError={(e) => {
                  // Fallback image if the product image fails to load
                  (e.target as HTMLImageElement).src = '/product.png';
                }}
              />
            </div>

            <div className="px-4 pb-6 flex flex-col items-center gap-4">
              <div className="text-center mt-5 w-full">
                <h3 className="text-green-900 text-xl font-semibold">{product.name}</h3>
                <p className="text-green-900 text-lg font-bold mb-4">৳{product.price.toFixed(2)}</p>
                <button 
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (!isAuthenticated) {
                      toast.error('Please login to add items to cart');
                      return;
                    }
                    setAddingToCart(product._id);
                    try {
                      console.log('Adding to cart:', product._id);
                      await addToCart(product._id, 1);
                      toast.success('Added to cart!');
                      console.log('Successfully added to cart');
                    } catch (error: any) {
                      console.error('Add to cart error:', error);
                      const errorMessage = error.response?.data?.message || 'Failed to add to cart';
                      toast.error(errorMessage);
                      
                      // If unauthorized, clear auth state
                      if (error.response?.status === 401) {
                        localStorage.removeItem('token');
                        window.location.href = '/login';
                      }
                    } finally {
                      setAddingToCart(null);
                    }
                  }}
                  disabled={cartLoading && addingToCart === product._id}
                  className={`w-full py-3 px-4 bg-green-900 text-white text-sm rounded-sm hover:bg-green-800 transition flex items-center justify-center gap-2 ${cartLoading && addingToCart === product._id ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {cartLoading && addingToCart === product._id ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="absolute top-4 right-4 flex flex-col gap-2">
              {icons.map((Icon, j) => (
                <div key={j} className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow">
                  <Icon className="w-4 h-4 text-black" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BestSellers;
