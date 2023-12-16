import { Injectable, OnInit, WritableSignal, signal } from "@angular/core";
import axios, { AxiosError } from "axios";
import {
  APIProduct,
  API_URL,
  CategoryID,
  FormProduct,
  Product,
} from "../../../models";
import { categoryById } from "../../../helpers";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  products: WritableSignal<Product[]> = signal([]);
  constructor() {
    this.getProducts();
    console.log(this.products());
  }

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

  private async getProducts() {
    try {
      const res = await axios.get(`${API_URL}/product`);
      const products = res.data.map((product: APIProduct) => ({
        ...product,
        category: categoryById(product.category),
      }));
      this.products.set(products);
      return products;
    } catch (error) {
      throw error as AxiosError;
    }
  }

  async updateProduct(product: Product) {
    try {
      const res = await axios.put(`${API_URL}/product/${product.id}`, {
        ...product,
        category: product.category.id,
      });
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
