import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import useOrderStore from '../store/useOrderStore';
import type { Order } from '../types/order';

const EditOrderPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { order, fetchOrderById, updateOrder } = useOrderStore();
  const [formData, setFormData] = useState<Partial<Order> | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadOrder = async () => {
      if (id) {
        setLoading(true);
        try {
          await fetchOrderById(id);
        } catch (error) {
          toast.error('Failed to load order');
        } finally {
          setLoading(false);
        }
      }
    };

    loadOrder();
  }, [id, fetchOrderById]);

  useEffect(() => {
    if (order) {
      setFormData({
        status: order.status,
        shippingAddress: { ...order.shippingAddress },
        isPaid: order.isPaid,
        isDelivered: order.isDelivered,
      });
    }
  }, [order]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('shippingAddress.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev!,
        shippingAddress: {
          ...prev!.shippingAddress!,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev!,
        [name]: name === 'isPaid' || name === 'isDelivered' ? value === 'true' : value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !id) return;

    try {
      setLoading(true);
      await updateOrder({
        ...order!,
        ...formData,
        _id: id,
      });
      toast.success('Order updated successfully');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error('Failed to update order');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !order) return <div>Loading...</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Order #{order._id}</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Order Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={formData?.status || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
              <select
                name="isPaid"
                value={String(formData?.isPaid || false)}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="true">Paid</option>
                <option value="false">Not Paid</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Status</label>
              <select
                name="isDelivered"
                value={String(formData?.isDelivered || false)}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="true">Delivered</option>
                <option value="false">Not Delivered</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="shippingAddress.fullName"
                value={formData?.shippingAddress?.fullName || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                name="shippingAddress.address"
                value={formData?.shippingAddress?.address || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                name="shippingAddress.city"
                value={formData?.shippingAddress?.city || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
              <input
                type="text"
                name="shippingAddress.postalCode"
                value={formData?.shippingAddress?.postalCode || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input
                type="text"
                name="shippingAddress.country"
                value={formData?.shippingAddress?.country || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="text"
                name="shippingAddress.phone"
                value={formData?.shippingAddress?.phone || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="shippingAddress.email"
                value={formData?.shippingAddress?.email || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/dashboard')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditOrderPage;
