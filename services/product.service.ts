import type { ProductsApiResponse } from "@/types/product-search";
import type { Product } from "@prisma/client";

const PRODUCT_API = "/api/products";

export const productService = {
  async search(query: string): Promise<Product[]> {
    const params = new URLSearchParams({
      q: query,
    });

    const response = await fetch(`${PRODUCT_API}?${params}`);

    if (!response.ok) {
      throw new Error("Failed to search products");
    }

    const result: ProductsApiResponse = await response.json();

    if (!result.success) {
      throw new Error("Product search failed");
    }

    return result.data;
  },

  async getTrending(): Promise<Product[]> {
    const response = await fetch(`${PRODUCT_API}?limit=5`);

    if (!response.ok) {
      throw new Error("Failed to fetch trending products");
    }

    const result: ProductsApiResponse = await response.json();

    if (!result.success) {
      throw new Error("Failed to fetch trending products");
    }

    return result.data.slice(0, 4);
  },
};
