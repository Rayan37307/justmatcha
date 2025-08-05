import { create } from "zustand";
import api from "../utils/axios";
import toast from "react-hot-toast";
import type { Order } from "../types/order";

interface OrderState {
  orders: Order[];
  order: Order | null;
  loading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  fetchOrderById: (id: string) => Promise<void>;
  createOrder: (order: Order) => Promise<void>;
  updateOrder: (order: Order) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
}

const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  order: null,
  loading: false,
  error: null,

  fetchOrders: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get("/orders");
      set({ orders: data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      toast.error("❌ Failed to fetch orders");
    }
  },

  fetchOrderById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get(`/orders/${id}`);
      set({ order: data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      toast.error("❌ Failed to fetch order details");
    }
  },

  createOrder: async (order: Order) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post("/orders", order);
      set((state) => ({
        orders: [...state.orders, data],
        loading: false,
      }));
      toast.success("✅ Order created successfully!");
    } catch (error: any) {
      set({ error: error.message, loading: false });
      toast.error("❌ Failed to create order");
    }
  },

  updateOrder: async (order: Order) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.put(`/orders/${order._id}/edit`, order);
      set((state) => ({
        orders: state.orders.map((o) => (o._id === order._id ? data : o)),
        loading: false,
      }));
      toast.success("📝 Order updated");
    } catch (error: any) {
      set({ error: error.message, loading: false });
      toast.error("❌ Failed to update order");
    }
  },

  deleteOrder: async (orderId: string) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/orders/${orderId}`);
      set((state) => ({
        orders: state.orders.filter((o) => o._id !== orderId),
        loading: false,
      }));
      toast.success("🗑️ Order deleted");
    } catch (error: any) {
      set({ error: error.message, loading: false });
      toast.error("❌ Failed to delete order");
    }
  },
}));

export default useOrderStore;
