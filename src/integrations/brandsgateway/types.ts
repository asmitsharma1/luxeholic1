// BrandsGateway API Types

export interface BrandsGatewayProduct {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: string;
  subcategory?: string;
  description: string;
  price: number;
  retail_price: number;
  currency: string;
  images: string[];
  sizes: ProductSize[];
  colors: string[];
  gender: "men" | "women" | "unisex" | "kids";
  season?: string;
  material?: string;
  made_in?: string;
  stock_quantity: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductSize {
  size: string;
  ean: string;
  stock: number;
}

export interface BrandsGatewayBrand {
  id: string;
  name: string;
  logo?: string;
  description?: string;
}

export interface BrandsGatewayCategory {
  id: string;
  name: string;
  subcategories?: string[];
}

export interface ProductFilters {
  brand?: string;
  category?: string;
  subcategory?: string;
  gender?: string;
  min_price?: number;
  max_price?: number;
  size?: string;
  color?: string;
  season?: string;
  page?: number;
  limit?: number;
  sort_by?: "price_asc" | "price_desc" | "name_asc" | "name_desc" | "newest";
}

export interface ProductsResponse {
  products: BrandsGatewayProduct[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface OrderItem {
  product_id: string;
  sku: string;
  size: string;
  quantity: number;
  price: number;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  shipping_address: {
    name: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state?: string;
    postal_code: string;
    country: string;
    phone: string;
  };
  billing_address?: {
    name: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state?: string;
    postal_code: string;
    country: string;
  };
}

export interface Order {
  id: string;
  order_number: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: OrderItem[];
  subtotal: number;
  shipping_cost: number;
  total: number;
  currency: string;
  shipping_address: any;
  billing_address?: any;
  tracking_number?: string;
  created_at: string;
  updated_at: string;
}
