import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, CheckCircle, Clock, Truck } from 'lucide-react';
import { Button } from '../components/Button';
import useOrderStore from '../store/useOrderStore';
import { format } from 'date-fns';

const OrderDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { order, loading, fetchOrderById } = useOrderStore();

  useEffect(() => {
    if (id) fetchOrderById(id);
  }, [id, fetchOrderById]);

  if (loading || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center text-green-900 font-medium">
        Loading order details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <Button onClick={() => navigate(-1)} className="mb-6 text-green-900 hover:text-green-900">
          <ArrowLeft className="mr-2" /> Back to Orders
        </Button>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-green-800">
                Order #{order._id.slice(-6).toUpperCase()}
              </h1>
              <p className="text-gray-600">
                Placed on {format(new Date(order.createdAt), 'MMMM d, yyyy')}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-2 bg-green-100 text-green-900 px-3 py-1 rounded-full text-sm font-medium">
              <CheckCircle size={18} />
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Order Items */}
            <div>
              <h2 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
                <Package size={20} /> Order Items
              </h2>
              <div className="space-y-4">
                {order.orderItems.map((item, i) => (
                  <div key={i} className="flex justify-between items-start border-b pb-3">
                    <div>
                      <h3 className="font-medium text-green-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-green-900 font-semibold">${item.price.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary + Shipping */}
            <div>
              <h2 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
                <Clock size={20} /> Order Summary
              </h2>
              <div className="bg-green-50 rounded-md p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${order.itemsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${order.shippingPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${order.taxPrice.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${order.totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-lg font-semibold text-green-900 mb-2 flex items-center gap-2">
                  <Truck size={20} /> Shipping Address
                </h2>
                <div className="bg-gray-50 p-4 rounded-md text-sm leading-relaxed">
                  <p>{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  <p className="mt-2">
                    <span className="font-medium">Phone:</span> {order.shippingAddress.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
