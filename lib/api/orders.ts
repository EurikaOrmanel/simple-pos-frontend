import { apiRequest } from "./client";
import { getAuthToken } from "../utils";

export interface OrderItem {
  id: string;
  product: {
    id: string;
    name: string;
    price: string;
    image: string;
  };
  quantity: number;
  created_at: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
}

export interface Order {
  id: string;
  customer_id: string;
  items: OrderItem[];
  customer: Customer;
}

export interface OrderItemInput {
  product_id: string;
  quantity: number;
}

export interface OrderInput {
  customer_id: string;
  items: OrderItemInput[];
}

export type OrdersResponse = Order[];

export const ordersApi = {
  getAll: async (page = 1, limit = 10): Promise<OrdersResponse> => {
    const token = getAuthToken();
    if (!token) throw new Error("Authentication required");

    return apiRequest(`/v1/admins/orders?page=${page}&limit=${limit}`, {
      token,
    });
  },

  getById: async (id: string): Promise<Order> => {
    const token = getAuthToken();
    if (!token) throw new Error("Authentication required");

    return apiRequest(`/v1/sales_persons/orders/${id}`, {
      token,
    });
  },

  create: async (data: OrderInput): Promise<Order> => {
    const token = getAuthToken();
    if (!token) throw new Error("Authentication required");

    return apiRequest("/v1/sales_persons/orders/create", {
      method: "POST",
      body: data,
      token,
    });
  },
};
