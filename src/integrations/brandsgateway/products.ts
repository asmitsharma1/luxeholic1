import brandsGatewayAPI from "./config";
import type {
  BrandsGatewayProduct,
  ProductsResponse,
  ProductFilters,
  BrandsGatewayBrand,
  BrandsGatewayCategory,
} from "./types";

// Get all products with optional filters
export const getProducts = async (filters?: ProductFilters): Promise<ProductsResponse> => {
  try {
    const response = await brandsGatewayAPI.get("/products", {
      params: filters,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch products");
  }
};

// Get a single product by ID
export const getProductById = async (productId: string): Promise<BrandsGatewayProduct> => {
  try {
    const response = await brandsGatewayAPI.get(`/products/${productId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch product");
  }
};

// Get products by brand
export const getProductsByBrand = async (
  brandName: string,
  filters?: Omit<ProductFilters, "brand">,
): Promise<ProductsResponse> => {
  try {
    const response = await brandsGatewayAPI.get("/products", {
      params: {
        brand: brandName,
        ...filters,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch products by brand");
  }
};

// Get products by category
export const getProductsByCategory = async (
  category: string,
  filters?: Omit<ProductFilters, "category">,
): Promise<ProductsResponse> => {
  try {
    const response = await brandsGatewayAPI.get("/products", {
      params: {
        category,
        ...filters,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch products by category");
  }
};

// Get all available brands
export const getBrands = async (): Promise<BrandsGatewayBrand[]> => {
  try {
    const response = await brandsGatewayAPI.get("/brands");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch brands");
  }
};

// Get all categories
export const getCategories = async (): Promise<BrandsGatewayCategory[]> => {
  try {
    const response = await brandsGatewayAPI.get("/categories");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch categories");
  }
};

// Search products
export const searchProducts = async (
  searchQuery: string,
  filters?: ProductFilters,
): Promise<ProductsResponse> => {
  try {
    const response = await brandsGatewayAPI.get("/products/search", {
      params: {
        q: searchQuery,
        ...filters,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to search products");
  }
};

// Get featured/new arrivals
export const getNewArrivals = async (limit: number = 12): Promise<ProductsResponse> => {
  try {
    const response = await brandsGatewayAPI.get("/products", {
      params: {
        sort_by: "newest",
        limit,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch new arrivals");
  }
};

// Check product availability
export const checkProductAvailability = async (
  productId: string,
  size: string,
): Promise<{ available: boolean; stock: number }> => {
  try {
    const response = await brandsGatewayAPI.get(`/products/${productId}/availability`, {
      params: { size },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to check availability");
  }
};
