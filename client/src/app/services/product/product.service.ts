import { Injectable, WritableSignal, effect, signal } from "@angular/core";
import axios, { AxiosError } from "axios";
import { Product, API_URL, FormProduct } from "../../../models";
import { AuthService } from "../auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  products: WritableSignal<Product[]> = signal([]);
  constructor(private authService: AuthService) {
    this.getProducts();
    effect(() => {
      // We need to trigger this to run the effect every time the user changes
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const user = this.authService.user();
      this.getProducts();
    });
  }

  async createProduct(product: FormProduct, vendorId: string) {
    try {
      const res = await axios.post<Product>(`${API_URL}/product`, {
        ...product,
        vendorId,
      });
      this.products.update((products) => [...products, res.data]);
      this.getProducts();
      return res.data;
    } catch (error) {
      throw error as AxiosError;
    }
  }

  async getProducts(vendorId?: string) {
    try {
      const url = `${API_URL}/product${
        vendorId ? `?vendorId=${vendorId}` : ""
      }`;
      const res = await axios.get<Product[]>(url);
      const products = res.data;
      if (!vendorId) this.products.set(products);
      return products;
    } catch (error) {
      throw error as AxiosError;
    }
  }

  async getProduct(productId: string) {
    try {
      const res = await axios.get<Product>(`${API_URL}/product/${productId}`);
      return res.data;
    } catch (error) {
      throw error as AxiosError;
    }
  }

  async updateProduct(product: Product) {
    try {
      const res = await axios.put(`${API_URL}/product/${product.id}`, {
        ...product,
      });
      const productData = res.data as Product;
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
}
