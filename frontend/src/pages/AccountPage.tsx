import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import useAuthStore from '../store/useAuthStore';
import api from '../utils/axios';
import type { Order } from '../types/order';

const AccountPage = () => {
  const { user, updateProfile, logout } = useAuthStore();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState({
    profile: false,
    password: false,
    orders: false
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(prev => ({ ...prev, orders: true }));
        const { data } = await api.get<{ success: boolean; data: Order[] }>('/orders/my-orders');
        if (data.success) {
          setOrders(data.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        toast.error('Failed to load order history');
      } finally {
        setLoading(prev => ({ ...prev, orders: false }));
      }
    };

    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name,
        email: user.email
      }));
      fetchOrders();
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (activeTab === 'profile') {
        setLoading(prev => ({ ...prev, profile: true }));
        const { name, email } = formData;
        await updateProfile({ name, email });
        toast.success('Profile updated successfully');
        setIsEditing(false);
      } else if (activeTab === 'security' && formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          toast.error('New passwords do not match');
          return;
        }
        
        setLoading(prev => ({ ...prev, password: true }));
        await updateProfile({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        });
        
        // Clear password fields after successful update
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
        
        toast.success('Password updated successfully');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update';
      toast.error(message);
    } finally {
      setLoading(prev => ({
        ...prev,
        profile: false,
        password: false
      }));
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center  py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Please sign in</h2>
            <p className="mt-2 text-sm text-gray-600">You need to be logged in to view this page</p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/login')}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">My Account</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage your account settings and view order history</p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Sign out
            </button>
          </div>
          
          <div className="border-t border-gray-200">
            <div className="md:flex">
              {/* Sidebar */}
              <div className="md:w-1/4 border-r border-gray-200">
                <nav className="flex-1 px-2 py-4 space-y-1">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === 'profile' 
                        ? 'bg-green-50 border-green-500 text-green-700 border-l-4' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === 'orders' 
                        ? 'bg-green-50 border-green-500 text-green-700 border-l-4' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    My Orders
                  </button>
                  <button
                    onClick={() => setActiveTab('addresses')}
                    className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === 'addresses' 
                        ? 'bg-green-50 border-green-500 text-green-700 border-l-4' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    Addresses
                  </button>
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === 'security' 
                        ? 'bg-green-50 border-green-500 text-green-700 border-l-4' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    Security
                  </button>
                </nav>
              </div>

              {/* Main Content */}
              <div className="md:w-3/4 p-6">
                {activeTab === 'profile' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
                      {!isEditing && (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="text-sm font-medium text-green-600 hover:text-green-500"
                        >
                          Edit Profile
                        </button>
                      )}
                    </div>

                    {isEditing ? (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                          <div className="sm:col-span-3">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                              Full name
                            </label>
                            <input
                              type="text"
                              name="name"
                              id="name"
                              value={formData.name}
                              onChange={handleChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            />
                          </div>

                          <div className="sm:col-span-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                              Email address
                            </label>
                            <input
                              type="email"
                              name="email"
                              id="email"
                              value={formData.email}
                              onChange={handleChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                          <button
                            type="button"
                            onClick={() => {
                              setIsEditing(false);
                              setFormData(prev => ({
                                ...prev,
                                name: user?.name || '',
                                email: user?.email || ''
                              }));
                            }}
                            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={loading.profile}
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loading.profile ? 'Saving...' : 'Save Changes'}
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                            <div className="sm:col-span-1">
                              <dt className="text-sm font-medium text-gray-500">Full name</dt>
                              <dd className="mt-1 text-sm text-gray-900">{user.name}</dd>
                            </div>
                            <div className="sm:col-span-1">
                              <dt className="text-sm font-medium text-gray-500">Email address</dt>
                              <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                            </div>
                            <div className="sm:col-span-1">
                              <dt className="text-sm font-medium text-gray-500">Member since</dt>
                              <dd className="mt-1 text-sm text-gray-900">
                                {new Date(user.createdAt).toLocaleDateString()}
                              </dd>
                            </div>
                            <div className="sm:col-span-1">
                              <dt className="text-sm font-medium text-gray-500">Account type</dt>
                              <dd className="mt-1 text-sm text-gray-900">
                                {user.isAdmin ? 'Administrator' : 'Standard'}
                              </dd>
                            </div>
                          </dl>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'orders' && (
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-6">Order History</h2>
                    {orders.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Order ID
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total
                              </th>
                              <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">View</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map((order: any) => (
                              <tr key={order._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {order._id.substring(0, 8)}...
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    order.status === 'completed' 
                                      ? 'bg-green-100 text-green-800' 
                                      : order.status === 'processing' 
                                        ? 'bg-yellow-100 text-yellow-800' 
                                        : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  ${order.totalPrice?.toFixed(2) || '0.00'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <button 
                                    onClick={() => navigate(`/orders/${order._id}`)}
                                    className="text-green-600 hover:text-green-900"
                                  >
                                    View
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No orders</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Get started by placing a new order.
                        </p>
                        <div className="mt-6">
                          <button
                            onClick={() => navigate('/products')}
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            Continue Shopping
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'addresses' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-medium text-gray-900">Saved Addresses</h2>
                      <button className="text-sm font-medium text-green-600 hover:text-green-500">
                        Add New Address
                      </button>
                    </div>
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <p className="text-sm text-gray-500">No saved addresses yet.</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-6">Change Password</h2>
                    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                          Current password
                        </label>
                        <div className="mt-1">
                          <input
                            id="currentPassword"
                            name="currentPassword"
                            type="password"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                          New password
                        </label>
                        <div className="mt-1">
                          <input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            value={formData.newPassword}
                            onChange={handleChange}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                          Confirm new password
                        </label>
                        <div className="mt-1">
                          <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={loading.password}
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading.password ? 'Updating...' : 'Update Password'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
