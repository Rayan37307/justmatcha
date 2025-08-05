import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Search, ChevronDown, Star } from 'lucide-react';
import api from '../utils/axios';
import { Button } from '../components/Button';
import type { Product } from '../types/index';
import useCartStore from '../store/useCartStore';
import useWishlistStore from '../store/useWishlistStore';
import ProductCard from '../components/ProductCard';

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('price-asc');
  const [filters, setFilters] = useState({
    category: '',
    priceRange: { min: 0, max: 100 },
    rating: 0,
  });

  const { addToCart } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/products');
        setProducts(response.data.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  const handleAddToCart = (productId: string) => {
    addToCart(productId, 1);
  };

  const handleWishlistToggle = async (productId: string) => {
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  // Apply filters and sorting
  const filteredAndSortedProducts = [...products]
    .filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(product => 
      filters.category ? product.category === filters.category : true
    )
    .filter(product => 
      product.price >= filters.priceRange.min && 
      product.price <= filters.priceRange.max
    )
    .filter(product => 
      filters.rating ? product.rating >= filters.rating : true
    )
    .sort((a, b) => {
      switch (sortOption) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'rating-desc':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-pulse">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with title and search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">All Products</h1>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <Filter size={18} className="mr-2" />
              Filters
            </h3>
            
            {/* Price Range Filter */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Price Range</h4>
              <div className="flex items-center justify-between mb-2">
                <span>${filters.priceRange.min}</span>
                <span>${filters.priceRange.max}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={filters.priceRange.max}
                onChange={(e) => setFilters({...filters, priceRange: {...filters.priceRange, max: parseInt(e.target.value)}})}
                className="w-full"
              />
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Category</h4>
              <select
                className="w-full p-2 border rounded-md"
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
              >
                <option value="">All Categories</option>
                <option value="matcha">Matcha</option>
                <option value="tea">Tea</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>

            {/* Rating Filter */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Rating</h4>
              {[4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center mb-2">
                  <input
                    type="radio"
                    id={`rating-${rating}`}
                    name="rating"
                    checked={filters.rating === rating}
                    onChange={() => setFilters({...filters, rating})}
                    className="mr-2"
                  />
                  <label htmlFor={`rating-${rating}`} className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        className={`${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                    <span className="ml-1 text-sm">& Up</span>
                  </label>
                </div>
              ))}
              <button 
                onClick={() => setFilters({...filters, rating: 0})}
                className="text-sm text-blue-600 hover:underline mt-2"
              >
                Clear Rating
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Sort Options */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-gray-600">
              Showing {filteredAndSortedProducts.length} products
            </p>
            <div className="flex items-center">
              <label htmlFor="sort" className="text-sm text-gray-600 mr-2">Sort by:</label>
              <div className="relative">
                <select
                  id="sort"
                  className="appearance-none bg-white border rounded-md pl-3 pr-8 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={sortOption}
                  onChange={handleSortChange}
                >
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                  <option value="rating-desc">Highest Rated</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {filteredAndSortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">No products found</h3>
              <p className="mt-2 text-sm text-gray-500">
                Try adjusting your search or filter to find what you're looking for.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilters({
                    category: '',
                    priceRange: { min: 0, max: 100 },
                    rating: 0,
                  });
                }}
                className="mt-4 px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
