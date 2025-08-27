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
  className={`relative flex flex-col w-full bg-white rounded-xl overflow-hidden 
    shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${className}`}
>
  {/* Product Image */}
  <Link to={`/products/${product._id}`} className="block">
    <div className="relative w-full aspect-[3/4] overflow-hidden group">
      <img
        src={product.image}
        alt={product.name}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/product.png";
        }}
      />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>

      {/* Wishlist */}
      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex flex-col gap-2 cursor-pointer">
        <WishlistButton
          productId={product._id}
          size="sm"
          className="bg-white/90 hover:bg-white p-1.5 sm:p-2 rounded-full shadow-md z-10 transition"
        />
      </div>
    </div>
  </Link>

  {/* Content */}
  <div className="flex flex-col flex-grow px-3 sm:px-4 py-3 sm:py-4">
    <Link
      to={`/products/${product._id}`}
      className="hover:opacity-80 transition-opacity flex-grow"
    >
      <h3 className="text-green-900 text-base sm:text-lg font-semibold mb-1 line-clamp-1">
        {product.name}
      </h3>
      <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 mb-2 sm:mb-3">
        {product.description || "No description available."}
      </p>
      <p className="text-green-900 text-lg sm:text-xl font-bold">
        ৳{product.price.toLocaleString()}
      </p>
    </Link>

    {/* Button */}
    <div className="mt-auto pt-3 sm:pt-4">
      <button
        onClick={handleAddToCart}
        disabled={addingToCart}
        aria-label="Add to cart"
        className={`w-full py-2.5 sm:py-3 px-3 sm:px-4 bg-green-900 text-white 
          text-xs sm:text-sm rounded-lg flex flex-col sm:flex-row items-center 
          justify-center gap-1 sm:gap-2 text-center transition-all duration-300 
          ${
            addingToCart
              ? "opacity-70 cursor-not-allowed"
              : "hover:bg-green-800 active:scale-95"
          }`}
      >
        {addingToCart ? (
          <span>Adding...</span>
        ) : (
          <span>Add to Cart</span>
        )}
      </button>
    </div>
  </div>
</div>

  );
};

export default ProductCard;
