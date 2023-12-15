import { Injectable } from "@angular/core";
import axios, { AxiosError } from "axios";
import { API_URL, CategoryID, Product } from "../../../ts";
import { categoryById } from "../../../helpers";

export interface FormProduct
  extends Omit<Product, "id" | "category" | "createdAt" | "updatedAt"> {
  category: CategoryID;
}

@Injectable({
  providedIn: "root",
})
export class ProductService {
  constructor() {}

  async createProduct(product: FormProduct) {
    try {
      const res = await axios.post(`${API_URL}/product`, { ...product });
      const productData = {
        ...res.data,
        category: categoryById(res.data.category),
      } as Product;
      return productData;
    } catch (error) {
      throw error as AxiosError;
    }
  }
}
