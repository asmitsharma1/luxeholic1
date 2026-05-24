import brandsGatewayAPI from "./config";
import type { CreateOrderRequest, Order } from "./types";

// Create a new order
export const createOrder = async (orderData: CreateOrderRequest): Promise<Order> => {
  try {
    const response = await brandsGatewayAPI.post("/orders", orderData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to create order");
  }
};

// Get order by ID
export const getOrderById = async (orderId: string): Promise<Order> => {
  try {
    const response = await brandsGatewayAPI.get(`/orders/${orderId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch order");
  }
};

// Get all orders for the authenticated user
export const getOrders = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<{ orders: Order[]; total: number; page: number; total_pages: number }> => {
  try {
    const response = await brandsGatewayAPI.get("/orders", { params });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch orders");
  }
};

// Cancel an order
export const cancelOrder = async (orderId: string): Promise<Order> => {
  try {
    const response = await brandsGatewayAPI.post(`/orders/${orderId}/cancel`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to cancel order");
  }
};

// Get order tracking information
export const getOrderTracking = async (
  orderId: string,
): Promise<{
  tracking_number: string;
  carrier: string;
  status: string;
  tracking_url?: string;
}> => {
  try {
    const response = await brandsGatewayAPI.get(`/orders/${orderId}/tracking`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch tracking information");
  }
};

// Calculate shipping cost
export const calculateShipping = async (data: {
  items: Array<{ product_id: string; quantity: number }>;
  country: string;
  postal_code: string;
}): Promise<{ shipping_cost: number; estimated_delivery_days: number }> => {
  try {
    const response = await brandsGatewayAPI.post("/orders/calculate-shipping", data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to calculate shipping");
  }
};
