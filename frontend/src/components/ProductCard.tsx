import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import useCartStore from "../store/useCartStore";
import useAuthStore from "../store/useAuthStore";
import WishlistButton from "./WishlistButton";

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
    description?: string;
  };
  onAddToCart?: () => void;
  className?: string;
}

const ProductCard = ({
  product,
  onAddToCart,
  className = "",
}: ProductCardProps) => {
  const [addingToCart, setAddingToCart] = useState(false);
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return;
    }

    setAddingToCart(true);
    try {
      await addToCart(product._id, 1);
      toast.success("Added to cart!");
      onAddToCart?.();
    } catch (error: any) {
      console.error("Add to cart error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to add to cart";
      toast.error(errorMessage);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div
      className={`relative flex flex-col w-full max-w-[300px] bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${className}`}
    >
      {/* Product Image */}
      <Link to={`/products/${product._id}`} className="block">
        <div className="relative overflow-hidden group">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-[220px] sm:h-[240px] md:h-[260px] object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/product.png";
            }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>

          {/* Wishlist */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 cursor-pointer">
            <WishlistButton
              productId={product._id}
              size="md"
              className="bg-white/90 hover:bg-white p-2 rounded-full shadow-md z-10 transition"
            />
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-grow px-4 py-4">
        <Link
          to={`/products/${product._id}`}
          className="hover:opacity-80 transition-opacity flex-grow"
        >
          <h3 className="text-green-900 text-lg font-semibold mb-1 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {product.description || "No description available."}
          </p>
          <p className="text-green-900 text-xl font-bold">
            ৳{product.price.toLocaleString()}
          </p>
        </Link>

        {/* Fixed Button at Bottom */}
        <div className="mt-auto pt-4">
          <button
            onClick={handleAddToCart}
            disabled={addingToCart}
            aria-label="Add to cart"
            className={`w-full py-3 px-4 bg-green-900 text-white text-sm rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${
              addingToCart
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-green-800 active:scale-95"
            }`}
          >
            {addingToCart ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0
                    5.373 0 12h4zm2 5.291A7.962 7.962 0
                    014 12H0c0 3.042 1.135 5.824 3
                    7.938l3-2.647z"
                  ></path>
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
    </div>
  );
};

export default ProductCard;
