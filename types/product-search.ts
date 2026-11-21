import type { Product } from "@prisma/client";

export interface ProductsApiResponse {
  success: boolean;
  data: Product[];
}
