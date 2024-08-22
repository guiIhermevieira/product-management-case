import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../product.service';
import { Product } from '../product.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];

  // Define columns for Material Table
  displayedColumns: string[] = ['id', 'name', 'quantity', 'measure', 'price', 'actions'];

  constructor(private productService: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.products = this.productService.getProducts();
  }

  removeProduct(id: number): void {
    this.productService.removeProduct(id);
    this.getProducts();  // Refresh the list after deletion
  }

  editProduct(id: number): void {
    console.log("esse é o id", id);
    this.router.navigate(['/edit', id]);
  }
}
