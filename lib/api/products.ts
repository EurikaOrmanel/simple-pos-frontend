import { apiRequest, uploadFile } from "./client";
import { getAuthToken } from "@/lib/utils";

export interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
}

export interface ProductCreateInput {
  name: string;
  price: number;
  image: string;
}

export interface ProductUpdateInput {
  name?: string | null;
  price?: number | null;
  image?: string | null;
}
export type ProductsResponse = Product[];

export const productsApi = {
  getAll: async (page = 1, limit = 10): Promise<ProductsResponse> => {
    const token = getAuthToken();
    if (!token) throw new Error("Authentication required");

    return apiRequest(`/v1/admins/products?page=${page}&limit=${limit}`, {
      token,
    });
  },
  getAllForSales: async (page = 1, limit = 10): Promise<ProductsResponse> => {
    const token = getAuthToken();
    if (!token) throw new Error("Authentication required");

    return apiRequest(
      `/v1/sales_persons/products?page=${page}&limit=${limit}`,
      {
        token,
      }
    );
  },

  getById: async (id: string): Promise<Product> => {
    const token = getAuthToken();
    if (!token) throw new Error("Authentication required");

    return apiRequest(`/v1/admins/products/${id}`, {
      token,
    });
  },

  create: async (data: ProductCreateInput): Promise<Product> => {
    const token = getAuthToken();
    if (!token) throw new Error("Authentication required");

    return apiRequest("/v1/admins/products", {
      method: "POST",
      body: data,
      token,
    });
  },

  update: async (id: string, data: ProductUpdateInput): Promise<Product> => {
    const token = getAuthToken();
    if (!token) throw new Error("Authentication required");

    return apiRequest(`/v1/admins/products/${id}`, {
      method: "PUT",
      body: data,
      token,
    });
  },

  delete: async (id: string): Promise<void> => {
    const token = getAuthToken();
    if (!token) throw new Error("Authentication required");

    return apiRequest(`/v1/admins/products/${id}`, {
      method: "DELETE",
      token,
    });
  },

  uploadImage: async (file: File): Promise<{ image: string }> => {
    const token = getAuthToken();
    if (!token) throw new Error("Authentication required");

    return uploadFile(file, token);
  },
};
