import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Heart, Minus, Plus, Loader2 } from 'lucide-react';
import { Button } from '../components/Button';
import useCartStore from '../store/useCartStore';
import useWishlistStore from '../store/useWishlistStore';
import useProductsStore from '../store/useProductsStore';
import toast from 'react-hot-toast';
import type { Product } from '../types';

interface ProductDetails extends Product {
  images: string[];
  details: string;
}

const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { fetchProductById } = useProductsStore();
  const { addToCart } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        setLoading(false);
        setError('No product ID provided');
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        const productData = await fetchProductById(id);
        // Transform the product data to match our extended interface
        const productDetails: ProductDetails = {
  ...productData,
  images: productData.image ? [productData.image] : [],
  details: productData.description || '',
};
        setProduct(productDetails);
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError('Failed to load product. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, fetchProductById, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-green-900" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md max-w-md w-full">
          <p>{error || 'Product not found'}</p>
          <Button 
            onClick={() => navigate('/products')} 
            className="mt-4 bg-green-900 hover:bg-green-900 text-white"
          >
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product._id, quantity);
    toast.success('Added to cart!');
  };

  const toggleWishlist = () => {
    if (!product) return;
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product._id);
    }
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/products" className="flex items-center text-green-900 hover:text-green-900">
              <ArrowLeft className="h-5 w-5 mr-1" />
              <span>Back to Products</span>
            </Link>
            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleWishlist}
                className={`p-2 rounded-full ${isInWishlist(product._id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
              >
                <Heart className={`h-6 w-6 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12">
          {/* Product Images */}
          <div className="mb-8 lg:mb-0">
            <div className="bg-white rounded-lg overflow-hidden shadow-md mb-4">
              <img 
                src={product.images[currentImage] || '/placeholder-product.jpg'} 
                alt={product.name}
                className="w-full h-96 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-product.jpg';
                }}
              />
            </div>
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {product.images.length > 0 ? product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${
                    currentImage === index ? 'border-green-900' : 'border-transparent'
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              )) : (
                <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                  <span className="text-xs">No images</span>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>


            <div className="text-3xl font-bold text-green-900 mb-6">
              ${product.price.toFixed(2)}
            </div>

            <p className="text-gray-700 mb-6">{product.description}</p>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Quantity</h3>
              <div className="flex items-center">
                <button
                  onClick={decrementQuantity}
                  className="p-2 border border-gray-300 rounded-l-md hover:bg-gray-50"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <div className="px-4 py-2 border-t border-b border-gray-300 bg-white">
                  {quantity}
                </div>
                <button
                  onClick={incrementQuantity}
                  className="p-2 border border-gray-300 rounded-r-md hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button 
                onClick={handleAddToCart}
                className="flex-1 bg-green-900 hover:bg-green-900 text-white py-3 px-6 rounded-md flex items-center justify-center"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Product Details</h3>
              <div className="prose prose-sm text-gray-500 whitespace-pre-line">
                {product?.details}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetailsPage;