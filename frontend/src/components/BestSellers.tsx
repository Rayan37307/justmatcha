import { useEffect } from "react";
import useProductsStore from "../store/useProductsStore";
import ProductCard from "./ProductCard";

const BestSellers = () => {
  const { products, loading, error, fetchProducts } = useProductsStore();

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
          <ProductCard 
            key={product._id} 
            product={product} 
          />
        ))}
      </div>
    </section>
  );
};

export default BestSellers;
