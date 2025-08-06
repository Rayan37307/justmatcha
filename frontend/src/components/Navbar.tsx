import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Menu, X, User2 } from 'lucide-react';
import useWishlistStore from '../store/useWishlistStore';
import { useState, useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';
import useCartStore from '../store/useCartStore';
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, logout } = useAuthStore();
  const { items: cartItems } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="fixed w-full z-50 transition-all duration-300 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="none">
  <g clip-path="url(#clip0_46_27)">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M2.16299 15.8852C3.67145 16.8121 5.02115 17.9577 6.17233 19.276C7.50505 20.8025 8.57252 22.561 9.3125 24.4816C10.5802 23.2344 11.9445 22.0978 13.3899 21.0811C11.7009 19.5799 9.79541 18.365 7.74942 17.4696C5.97665 16.6939 4.09796 16.1585 2.16299 15.8852ZM7.94914 17.0114C10.0785 17.9432 12.0602 19.2143 13.8121 20.7892C14.3642 20.4137 14.9277 20.0555 15.5016 19.7151C16.3583 19.207 17.2386 18.7384 18.1393 18.3111C15.5694 17.0311 12.8352 16.1605 10.0348 15.715C7.69112 15.3423 5.29972 15.2666 2.91817 15.4972C4.65544 15.7992 6.34438 16.309 7.94914 17.0114ZM15.7562 20.146C12.5422 22.0523 9.66301 24.5234 7.27256 27.4685C9.46021 28.9751 12.0816 29.8977 14.911 30.0104C16.1921 27.4759 17.7919 25.129 19.6631 23.0228C22.2297 20.1336 25.3075 17.6978 28.7734 15.8534C24.1207 16.3279 19.6879 17.8142 15.7562 20.146ZM20.0371 23.3557C18.2477 25.3699 16.7102 27.6082 15.4676 30.0222H15.5C23.4272 30.0222 29.8707 23.6707 30.0197 15.7792C26.1932 17.6461 22.8123 20.2317 20.0371 23.3557ZM15.5 7.1577C13.9521 8.80057 13.9521 11.3647 15.5 13.0076C17.0476 11.3647 17.0476 8.80057 15.5 7.1577ZM21.0502 9.96944C18.4831 10.046 16.4201 12.109 16.3435 14.676C18.9104 14.5994 20.9736 12.5365 21.0502 9.96944ZM14.6563 14.676C14.5799 12.109 12.5168 10.046 9.94989 9.96944C10.0264 12.5365 12.0894 14.5994 14.6563 14.676ZM5.79616 19.6051C4.448 18.0609 2.81997 16.7613 0.980469 15.7835C1.06988 20.4536 3.36391 24.5839 6.86505 27.1773C7.51693 26.3724 8.20466 25.6026 8.92529 24.8692C8.20454 22.9235 7.13934 21.1432 5.79628 19.6052L5.79616 19.6051Z" fill="#005C03"/>
    <path d="M26.1056 4.89442C23.3914 2.18028 19.6417 0.501316 15.4999 0.501316C11.3582 0.501316 7.60843 2.18028 4.89442 4.89442C2.18017 7.60855 0.501197 11.3582 0.501197 15.4999C0.501197 19.6417 2.18005 23.3914 4.8943 26.1055C7.60831 28.8196 11.3582 30.4986 15.4999 30.4986C19.6417 30.4986 23.3914 28.8197 26.1056 26.1055C28.8197 23.3914 30.4984 19.6418 30.4984 15.4999C30.4984 11.3581 28.8197 7.60855 26.1056 4.8943M15.4999 0C19.78 0 23.6552 1.73501 26.46 4.53986C29.265 7.34471 31 11.2199 31 15.4999C31 19.78 29.265 23.6553 26.46 26.46C23.6552 29.2649 19.78 31 15.4999 31C11.2199 31 7.3446 29.2649 4.53974 26.46C1.73501 23.6553 0 19.7801 0 15.4999C0 11.2198 1.73501 7.34471 4.53986 4.53986C7.3446 1.73501 11.2198 0 15.4999 0Z" fill="#005C03"/>
    <path d="M5.93442 10.6504C5.85047 10.7918 5.74562 10.9058 5.62 10.9924C5.49437 11.0791 5.35723 11.1296 5.2088 11.1441L5.0662 10.7427C5.18695 10.7316 5.29002 10.7022 5.37539 10.6544C5.46089 10.6067 5.52916 10.5396 5.58057 10.4531C5.71712 10.2231 5.64932 10.0273 5.37717 9.86566L4.23146 9.18517L3.76339 9.97324L3.41846 9.76829L4.13089 8.56879L5.59933 9.44093C5.86092 9.59636 6.01825 9.77613 6.07108 9.98012C6.12392 10.1842 6.07833 10.4076 5.9343 10.6502L5.93442 10.6504Z" fill="#005C03"/>
    <path d="M7.41179 8.62959C7.17217 8.88939 6.91154 9.02534 6.62989 9.03758C6.34813 9.04992 6.06933 8.92869 5.79338 8.67412L4.72461 7.68834L5.049 7.33664L6.10424 8.30982C6.29909 8.48948 6.47933 8.57817 6.64509 8.5758C6.81085 8.57342 6.96438 8.49565 7.1058 8.34224C7.24722 8.18895 7.31205 8.03008 7.30017 7.8655C7.2883 7.70105 7.185 7.52888 6.99015 7.34923L5.93491 6.37592L6.25432 6.02956L7.32309 7.01533C7.59904 7.26991 7.74236 7.53802 7.75293 7.81979C7.76338 8.10156 7.64974 8.37145 7.41191 8.62935L7.41179 8.62959Z" fill="#005C03"/>
    <path d="M9.25694 7.03017C9.09106 7.14416 8.91592 7.22942 8.73164 7.28606C8.54736 7.34281 8.38492 7.36419 8.24446 7.35053L8.17048 6.95026C8.30133 6.95869 8.44465 6.94207 8.60067 6.90039C8.7567 6.85883 8.90037 6.79281 9.03181 6.70245C9.14307 6.62611 9.22476 6.55213 9.27689 6.48053C9.3289 6.40905 9.35692 6.34149 9.36084 6.27773C9.36476 6.21408 9.34861 6.1559 9.31251 6.1033C9.2681 6.03859 9.20897 6.00249 9.13535 5.99501C9.06174 5.98753 8.98004 5.9975 8.89028 6.02493C8.80039 6.05248 8.70362 6.08691 8.59972 6.12847C8.49583 6.17015 8.38944 6.20814 8.28067 6.2427C8.17191 6.27725 8.06564 6.29815 7.96198 6.30527C7.8582 6.31252 7.7581 6.29566 7.66157 6.25481C7.56503 6.21396 7.47788 6.1369 7.39998 6.02362C7.32079 5.90833 7.27899 5.78152 7.27472 5.64295C7.27044 5.5045 7.31164 5.36308 7.39844 5.21857C7.48524 5.07407 7.62571 4.93514 7.81996 4.8018C7.94737 4.71429 8.08487 4.64364 8.23258 4.58985C8.38029 4.53606 8.52135 4.50757 8.65612 4.50436L8.74221 4.8962C8.60827 4.90499 8.48134 4.93028 8.36141 4.97243C8.24149 5.01458 8.13498 5.06766 8.04201 5.13154C7.93277 5.20658 7.85333 5.28056 7.80358 5.35334C7.75383 5.42625 7.72794 5.49464 7.7258 5.55864C7.72355 5.62264 7.74124 5.68201 7.77876 5.73663C7.82329 5.80135 7.88171 5.8378 7.95438 5.84599C8.02705 5.85418 8.10779 5.84409 8.19696 5.81559C8.28613 5.78722 8.3835 5.75231 8.48906 5.71098C8.59462 5.66966 8.70148 5.63131 8.80953 5.59569C8.91759 5.56019 9.02315 5.53834 9.12609 5.53003C9.22904 5.52183 9.32842 5.53846 9.42389 5.58002C9.51947 5.62157 9.60544 5.69804 9.68179 5.80918C9.75956 5.92246 9.80065 6.04832 9.80492 6.18677C9.8092 6.32522 9.7674 6.467 9.67965 6.61221C9.5919 6.75743 9.45084 6.89671 9.25671 7.03006L9.25694 7.03017Z" fill="#005C03"/>
    <path d="M10.8693 6.06566L9.99986 4.07547L9.21725 4.41732L9.05518 4.04626L11.0588 3.17092L11.2209 3.54198L10.4382 3.88383L11.3077 5.87401L10.8692 6.06554L10.8693 6.06566Z" fill="#005C03"/>
    <path d="M12.2899 5.43183L11.8618 2.89105L12.2502 2.82563L13.6734 4.49332L13.4701 4.52751L14.2502 2.48865L14.6386 2.42322L15.0703 4.96341L14.6238 5.03857L14.3101 3.19883L14.4045 3.18292L13.7363 4.88931L13.5258 4.92482L12.321 3.53391L12.4299 3.5155L12.7399 5.35584L12.2898 5.43159L12.2899 5.43183Z" fill="#005C03"/>
    <path d="M15.249 4.95889L16.6684 2.51584L17.1371 2.56452L18.0279 5.24755L17.53 5.19578L16.7778 2.78253L16.9681 2.80236L15.7397 5.00995L15.249 4.95901V4.95889ZM15.8415 4.42089L16.0085 4.06075L17.3924 4.20443L17.4818 4.59116L15.8415 4.42077V4.42089Z" fill="#005C03"/>
    <path d="M18.5923 5.48443L19.2451 3.41315L18.4307 3.15644L18.5524 2.7703L20.6377 3.42752L20.516 3.81366L19.7015 3.55694L19.0487 5.62822L18.5923 5.48443Z" fill="#005C03"/>
    <path d="M21.0684 6.58823C20.897 6.49264 20.7537 6.37545 20.6385 6.23688C20.5233 6.09831 20.4405 5.9468 20.3903 5.78247C20.34 5.61813 20.3243 5.44857 20.3432 5.27367C20.3621 5.09877 20.4181 4.92767 20.5113 4.76048C20.6045 4.5933 20.7205 4.45568 20.8595 4.34774C20.9983 4.23969 21.1514 4.16429 21.3187 4.12131C21.486 4.07833 21.6583 4.06906 21.8357 4.09352C22.0131 4.11798 22.1886 4.17866 22.3622 4.27543C22.5465 4.37826 22.6972 4.50365 22.8141 4.65172C22.931 4.79978 23.0073 4.96531 23.0431 5.14816L22.6314 5.25158C22.5989 5.11824 22.5446 5.00164 22.4684 4.90154C22.392 4.80145 22.295 4.71845 22.1772 4.65278C22.0593 4.587 21.9408 4.54628 21.8218 4.53048C21.7027 4.51469 21.5877 4.52217 21.4764 4.55281C21.3652 4.58344 21.2628 4.63604 21.1695 4.71037C21.076 4.7847 20.9971 4.87969 20.9325 4.99546C20.8679 5.11124 20.8286 5.22831 20.8145 5.34693C20.8003 5.46543 20.8095 5.58014 20.8418 5.69092C20.8741 5.8017 20.9283 5.90346 21.0043 5.99643C21.0803 6.08941 21.1772 6.16872 21.2951 6.23451C21.4129 6.30017 21.5345 6.33923 21.6598 6.35146C21.7849 6.36369 21.9134 6.34754 22.0451 6.3029L22.1718 6.71065C21.9986 6.77429 21.818 6.79578 21.6301 6.77524C21.442 6.7547 21.2547 6.69248 21.0683 6.58847L21.0684 6.58823Z" fill="#005C03"/>
    <path d="M22.2051 7.23262L23.9638 5.34954L24.3135 5.6762L22.5548 7.55928L22.2051 7.23262ZM23.279 6.72454L23.5579 6.42591L24.5882 7.38817L24.3093 7.6868L23.279 6.72454ZM23.5287 8.4687L25.2874 6.58562L25.6371 6.91227L23.8783 8.79535L23.5287 8.4687Z" fill="#005C03"/>
    <path d="M24.0211 8.9186L26.8146 8.49458L27.0702 8.89034L25.5369 11.2655L25.2653 10.8449L26.675 8.74678L26.7789 8.90755L24.2886 9.333L24.021 8.91872L24.0211 8.9186ZM24.8116 9.04339L25.1969 8.94793L25.9518 10.1167L25.7064 10.4286L24.8117 9.04339H24.8116Z" fill="#005C03"/>
  </g>
  <defs>
    <clipPath id="clip0_46_27">
      <rect width="31" height="31" fill="white"/>
    </clipPath>
  </defs>
</svg>
            <span className="text-2xl font-bold text-green-700">JustMatcha</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/products" className="text-green-600 transition-colors">
              Products
            </Link>
            <Link to="/about" className="text-green-600 transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-green-600 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4">

              
              <Link 
                to="/cart" 
                className="p-2 text-green-600 hover:text-green-600 relative"
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </span>
                )}
              </Link>

              {isAuthenticated ? (
                <>
                              <Link 
                to="/wishlist" 
                className="p-2 text-green-600 hover:text-green-600 relative"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistItems.length > 9 ? '9+' : wishlistItems.length}
                  </span>
                )}
              </Link>
                  <button 
                  className='p-2 text-green-600 hover:text-green-600 relative'
                    onClick={() => navigate('/account')}
                  >
                    <User2 />
                  </button>
                  <button 
                  className='px-4 py-2 bg-green-600 text-white rounded-sm hover:bg-green-700'
                    onClick={() => {
                      logout();
                      navigate('/login');
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => navigate('/register')}
                    className="bg-green-600 text-white px-3 py-1 rounded-sm hover:bg-green-700"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 text-green-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/products"
              className="block px-3 py-2 rounded-md text-base font-medium text-green-600 hover:text-green-600 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 rounded-md text-base font-medium text-green-600 hover:text-green-600 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 rounded-md text-base font-medium text-green-600 hover:text-green-600 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              to="/wishlist"
              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-green-600 hover:text-green-600 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              <Heart className="w-5 h-5 mr-2" />
              Wishlist
            </Link>
            <Link
              to="/cart"
              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-green-600 hover:text-green-600 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Cart
              {cartItemCount > 0 && (
                <span className="ml-2 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </span>
              )}
            </Link>
            
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    navigate('/account');
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-green-600 hover:text-green-600 hover:bg-gray-50"
                >
                  My Account
                </button>
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-green-600 hover:text-green-600 hover:bg-gray-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    navigate('/login');
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-green-600 hover:text-green-600 hover:bg-gray-50"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    navigate('/register');
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-green-600 hover:text-green-600 hover:bg-green-50"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
