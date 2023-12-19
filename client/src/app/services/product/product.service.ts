import { Injectable, WritableSignal, effect, signal } from "@angular/core";
import axios, { AxiosError } from "axios";
import { APIProduct, API_URL, FormProduct, Product } from "../../../models";
import { categoryById } from "../../../helpers";
import { AuthService } from "../auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  products: WritableSignal<Product[]> = signal([]);
  constructor(private authService: AuthService) {
    this.getProducts();
    effect(() => {
      const user = this.authService.user();
      this.getProducts();
    });
  }

  async createProduct(product: FormProduct, vendorId: string) {
    try {
      const res = await axios.post(`${API_URL}/product`, {
        ...product,
        vendorId,
      });
      this.products.update((products) => [...products, res.data]);
      this.getProducts();
      return this.synthesize<Product>(res.data);
    } catch (error) {
      throw error as AxiosError;
    }
  }

  async getProducts(vendorId?: string) {
    try {
      const url = `${API_URL}/product${
        vendorId ? `?vendorId=${vendorId}` : ""
      }`;
      const res = await axios.get<APIProduct[]>(url);
      const products = this.synthesize<Product[]>(res.data);
      if (!vendorId) this.products.set(products);
      return products;
    } catch (error) {
      throw error as AxiosError;
    }
  }

  async updateProduct(product: APIProduct) {
    try {
      const res = await axios.put(`${API_URL}/product/${product.id}`, {
        ...product,
      });
      const productData = {
        ...res.data,
        category: categoryById(res.data.category),
      } as Product;
      this.getProducts();
      return productData;
    } catch (error) {
      throw error as AxiosError;
    }
  }

  async deleteProduct(id: string) {
    try {
      await axios.delete(`${API_URL}/product/${id}`);
      this.products.update((products) =>
        products.filter((product) => product.id !== id),
      );
      this.getProducts();
    } catch (error) {
      throw error as AxiosError;
    }
  }

  private synthesize<T>(data: APIProduct | APIProduct[]) {
    if (Array.isArray(data)) {
      return data.map((product) => ({
        ...product,
        category: categoryById(product.category),
      })) as T;
    } else {
      return {
        ...data,
        category: categoryById(data.category),
      } as T;
    }
  }
}
