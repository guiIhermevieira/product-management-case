import { Injectable } from '@angular/core';
import { Product } from './product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private storageKey = 'products';

  constructor() { }

  // Get all products
  getProducts(): Product[] {
    const products = localStorage.getItem(this.storageKey);
    return products ? JSON.parse(products) : [];
  }

  // Save all products to localStorage
  saveProducts(products: Product[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(products));
  }

  // Get a product by its ID
  getProductById(id: number): Product | undefined {
    const products = this.getProducts();
    return products.find(product => product.id === id);
  }

  // Add a new product
  addProduct(product: Product): void {
    const products = this.getProducts();
    product.id = Date.now();  // Generate a unique ID based on timestamp
    products.push(product);
    this.saveProducts(products);
  }

  // Update an existing product
  updateProduct(updatedProduct: Product): void {
    const products = this.getProducts();
    const index = products.findIndex(product => product.id === updatedProduct.id);
    if (index !== -1) {
      products[index] = updatedProduct;
      this.saveProducts(products);
    }
  }

  // Remove a product by its ID
  removeProduct(id: number): void {
    const products = this.getProducts();
    const updatedProducts = products.filter(product => product.id !== id);
    this.saveProducts(updatedProducts);
  }
}
