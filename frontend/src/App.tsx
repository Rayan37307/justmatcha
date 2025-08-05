import { Route, BrowserRouter, Routes } from "react-router-dom"
import { Toaster } from 'react-hot-toast';
import { useEffect } from "react"
import Home from "./pages/Home"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import PaymentConformed from "./pages/PaymentConformed"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import Cart from "./pages/Cart"
import Wishlist from "./pages/Wishlist"
import CheckoutPage from "./pages/CheckoutPage"
import useAuthStore from "./store/useAuthStore"
import ProtectedRoute from "./components/ProtectedRoute"
import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";

const App = () => {
  const { initializeAuth, loading: authLoading } = useAuthStore();
  
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#EFF5EC]">
        <Toaster position="top-center" />
        <Navbar />
        <main className="flex-grow mt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/payment-confirmed" element={<PaymentConformed />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailsPage />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              {/* Add more protected routes here */}
            </Route>
            
            {/* Public routes */}
            <Route path="/cart" element={<Cart />} />
            
            {/* 404 - Keep this at the bottom */}
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
