import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useOrderStore from '../store/useOrderStore';

const OrderDetailsRoute = () => {
  const { id } = useParams<{ id: string }>();
  const { order, loading, error, fetchOrderById } = useOrderStore();

  useEffect(() => {
    if (id) {
      fetchOrderById(id);
    }
  }, [id, fetchOrderById]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-green-900">
        Loading order details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-red-600 font-semibold">
        Error loading order: {error}
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-gray-600">
        No order found.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-green-50 rounded-2xl shadow-md mt-10">
      <h1 className="text-3xl font-bold text-green-900 mb-6">🧾 Order Summary</h1>

      {/* Order Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-4 bg-white rounded-xl shadow">
          <h2 className="text-lg font-semibold text-green-800">Shipping</h2>
          <p><span className="font-medium">Name:</span> {order.shippingAddress.fullName}</p>
          <p>
            <span className="font-medium">Address:</span> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
          </p>
          <p><span className="font-medium">Phone:</span> {order.shippingAddress.phone}</p>
          <p><span className="font-medium">Email:</span> {order.shippingAddress.email}</p>
          <p className={`mt-2 text-sm font-medium ${order.isDelivered ? "text-green-900" : "text-red-600"}`}>
            {order.isDelivered 
              ? `Delivered on ${order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString() : 'N/A'}` 
              : "Not Delivered"}
          </p>
        </div>

        <div className="p-4 bg-white rounded-xl shadow">
          <h2 className="text-lg font-semibold text-green-800">Payment</h2>
          <p><span className="font-medium">Method:</span> {order.paymentMethod}</p>
          <p><span className="font-medium">Status:</span> {order.isPaid ? "Paid ✅" : "Not Paid ❌"}</p>
          {order.paidAt && (
            <p><span className="font-medium">Paid At:</span> {new Date(order.paidAt).toLocaleDateString()}</p>
          )}
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white p-4 rounded-xl shadow mb-8">
        <h2 className="text-lg font-semibold text-green-800 mb-4">🛍️ Items Ordered</h2>
        {order.orderItems.map((item: any, index: number) => (
          <div key={index} className="flex items-center justify-between py-3 border-b last:border-b-0">
            <div className="flex items-center gap-4">
              <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              </div>
            </div>
            <p className="font-semibold text-green-900">${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold text-green-800 mb-4">📦 Order Summary</h2>
        <div className="space-y-2">
          <p><span className="font-medium">Items:</span> ${order.itemsPrice.toFixed(2)}</p>
          <p><span className="font-medium">Tax:</span> ${order.taxPrice.toFixed(2)}</p>
          <p><span className="font-medium">Shipping:</span> ${order.shippingPrice.toFixed(2)}</p>
          <p className="text-xl font-bold text-green-900 border-t pt-2">Total: ${order.totalPrice.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsRoute;
