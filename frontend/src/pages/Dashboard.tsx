import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, fetchUser, loading, isAuthenticated } = useAuthStore();

  console.log('Dashboard render:', { user, loading, isAuthenticated });

  useEffect(() => {
    console.log('useEffect - auth state:', { isAuthenticated, loading, hasUser: !!user });
    
    // If not authenticated and not loading, redirect to login
    if (!isAuthenticated && !loading) {
      console.log('Not authenticated - redirecting to login');
      navigate('/login');
      return;
    }

    // If no user data but authenticated, fetch user
    if (isAuthenticated && !user) {
      console.log('Authenticated but no user data - fetching user');
      const loadUser = async () => {
        try {
          console.log('Calling fetchUser...');
          const userData = await fetchUser();
          console.log('Fetched user data:', userData);
        } catch (error) {
          console.error("Failed to load user:", error);
          logout();
        }
      };
      loadUser();
    }
  }, [user, isAuthenticated, loading, fetchUser, navigate, logout]);

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">JustMatcha</h1>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <span className="text-gray-500 mr-4">Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-10">
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h2>
                <p className="text-gray-600">Welcome to your dashboard, {user?.name}!</p>
                <p className="text-gray-600 mt-2">Your email: {user?.email}</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
