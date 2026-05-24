import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProducts,
  getProductById,
  getProductsByBrand,
  getProductsByCategory,
  getBrands,
  getCategories,
  searchProducts,
  getNewArrivals,
  checkProductAvailability,
  createOrder,
  getOrderById,
  getOrders,
  cancelOrder,
  getOrderTracking,
  calculateShipping,
} from "@/integrations/brandsgateway";
import type { ProductFilters, CreateOrderRequest } from "@/integrations/brandsgateway";

// Products hooks
export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: ["brandsgateway", "products", filters],
    queryFn: () => getProducts(filters),
  });
};

export const useProduct = (productId: string) => {
  return useQuery({
    queryKey: ["brandsgateway", "product", productId],
    queryFn: () => getProductById(productId),
    enabled: !!productId,
  });
};

export const useProductsByBrand = (brandName: string, filters?: Omit<ProductFilters, "brand">) => {
  return useQuery({
    queryKey: ["brandsgateway", "products", "brand", brandName, filters],
    queryFn: () => getProductsByBrand(brandName, filters),
    enabled: !!brandName,
  });
};

export const useProductsByCategory = (
  category: string,
  filters?: Omit<ProductFilters, "category">,
) => {
  return useQuery({
    queryKey: ["brandsgateway", "products", "category", category, filters],
    queryFn: () => getProductsByCategory(category, filters),
    enabled: !!category,
  });
};

export const useBrands = () => {
  return useQuery({
    queryKey: ["brandsgateway", "brands"],
    queryFn: getBrands,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["brandsgateway", "categories"],
    queryFn: getCategories,
  });
};

export const useSearchProducts = (searchQuery: string, filters?: ProductFilters) => {
  return useQuery({
    queryKey: ["brandsgateway", "search", searchQuery, filters],
    queryFn: () => searchProducts(searchQuery, filters),
    enabled: !!searchQuery && searchQuery.length > 2,
  });
};

export const useNewArrivals = (limit: number = 12) => {
  return useQuery({
    queryKey: ["brandsgateway", "new-arrivals", limit],
    queryFn: () => getNewArrivals(limit),
  });
};

export const useProductAvailability = (productId: string, size: string) => {
  return useQuery({
    queryKey: ["brandsgateway", "availability", productId, size],
    queryFn: () => checkProductAvailability(productId, size),
    enabled: !!productId && !!size,
  });
};

// Orders hooks
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderData: CreateOrderRequest) => createOrder(orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brandsgateway", "orders"] });
    },
  });
};

export const useOrder = (orderId: string) => {
  return useQuery({
    queryKey: ["brandsgateway", "order", orderId],
    queryFn: () => getOrderById(orderId),
    enabled: !!orderId,
  });
};

export const useOrders = (params?: { page?: number; limit?: number; status?: string }) => {
  return useQuery({
    queryKey: ["brandsgateway", "orders", params],
    queryFn: () => getOrders(params),
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => cancelOrder(orderId),
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: ["brandsgateway", "orders"] });
      queryClient.invalidateQueries({ queryKey: ["brandsgateway", "order", orderId] });
    },
  });
};

export const useOrderTracking = (orderId: string) => {
  return useQuery({
    queryKey: ["brandsgateway", "tracking", orderId],
    queryFn: () => getOrderTracking(orderId),
    enabled: !!orderId,
  });
};

export const useCalculateShipping = () => {
  return useMutation({
    mutationFn: (data: {
      items: Array<{ product_id: string; quantity: number }>;
      country: string;
      postal_code: string;
    }) => calculateShipping(data),
  });
};
