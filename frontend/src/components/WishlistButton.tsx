import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import useWishlistStore from '../store/useWishlistStore';
import useAuthStore from '../store/useAuthStore';

interface WishlistButtonProps {
  productId: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

const WishlistButton = ({ productId, size = 'md', className = '', onClick }: WishlistButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { addToWishlist, removeFromWishlist, isInWishlist, fetchWishlist } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();
  const isWishlisted = isInWishlist(productId);

  // Update local state when items change
  useEffect(() => {
    // Fetch wishlist when component mounts
    const initializeWishlist = async () => {
      if (isAuthenticated) {
        try {
          await fetchWishlist();
        } catch (error) {
          console.error('Failed to fetch wishlist:', error);
        }
      }
    };
    initializeWishlist();
  }, [isAuthenticated, fetchWishlist]);

  const handleClick = async (e: React.MouseEvent) => {
    console.log('WishlistButton clicked');
    
    // Call the onClick handler from props if provided
    if (onClick) {
      console.log('Calling onClick prop');
      onClick(e);
      // Don't return here, allow the default behavior to continue
    }
    
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading) {
      console.log('Button is already loading');
      return;
    }
    
    if (!isAuthenticated) {
      console.log('User not authenticated');
      toast.error('Please log in to manage your wishlist');
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isWishlisted) {
        console.log('Removing from wishlist:', productId);
        await removeFromWishlist(productId);
        toast.success('Removed from wishlist');
      } else {
        console.log('Adding to wishlist:', productId);
        await addToWishlist(productId);
        toast.success('Added to wishlist');
      }
      // Refresh wishlist to ensure state is in sync
      console.log('Refreshing wishlist');
      await fetchWishlist();
    } catch (error: any) {
      console.error('Wishlist error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update wishlist';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-900 ${
        isWishlisted ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-gray-500'
      } ${className}`}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        className={`${sizeClasses[size]} ${isWishlisted ? 'fill-current' : ''}`}
        aria-hidden="true"
      />
    </button>
  );
};

export default WishlistButton;
