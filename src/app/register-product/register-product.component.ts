import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ProductService } from '../product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, Measure } from '../product.model';
import { DatePipe } from '@angular/common';

// Custom validators for different units
function unitValidator(unit: Measure): ValidatorFn {
  switch (unit) {
    case Measure.Liter:
    case Measure.Kilogram:
      return (control: AbstractControl): { [key: string]: any } | null => {
        const value = control.value;
        if (value == null || value === '') {
          return null; // Allow empty values
        }
        const isValid = /^\d*\.?\d{0,3}$/.test(value); // Up to 3 decimal places
        return isValid ? null : { 'decimalLimit': { value: control.value } };
      };
    case Measure.Unit:
      return (control: AbstractControl): { [key: string]: any } | null => {
        const value = control.value;
        if (value == null || value === '') {
          return null; // Allow empty values
        }
        const isValid = /^\d+$/.test(value); // Only integers
        return isValid ? null : { 'integerLimit': { value: control.value } };
      };
    default:
      return () => null; // No validation
  }
}

@Component({
  selector: 'app-register-product',
  templateUrl: './register-product.component.html',
  styleUrls: ['./register-product.component.css'],
  providers: [DatePipe]
})
export class RegisterProductComponent implements OnInit {
  form: FormGroup;
  measures = Object.values(Measure);
  productId: number | null = null;

  constructor(private fb: FormBuilder, private productService: ProductService, private router: Router, private datePipe: DatePipe, private route: ActivatedRoute) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      measure: [null, Validators.required],
      quantity: [null],
      price: [null, [Validators.required]],
      perecible: [false],
      validityDate: [''],
      fabricationDate: ['']
    });
  }

  ngOnInit(): void {
    this.form.get('measure')?.valueChanges.subscribe(measure => {
      this.updateQuantityValidators(measure);
    });
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.productId = +id;
        this.loadProduct(this.productId);
      }
    })
  }

  loadProduct(id: number): void {
    const product = this.productService.getProductById(id);
    if (product) {
      this.form.patchValue({
        name: product.name,
        measure: product.measure,
        quantity: product.quantity,
        price: product.price,
        perecible: product.perecible,
        validityDate: product.validityDate,
        fabricationDate: product.fabricationDate
      });
    }
  }

  updateQuantityValidators(measure: Measure): void {
    const quantityControl = this.form.get('quantity');
    if (quantityControl) {
      quantityControl.clearValidators(); // Remove existing validators
      quantityControl.setValidators(unitValidator(measure)); // Set new validators based on measure
      quantityControl.updateValueAndValidity(); // Trigger validation
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      alert('Please fill in the required fields correctly.');
      return;
    }

    const { name, measure, quantity, price, perecible, validityDate, fabricationDate } = this.form.value;

    const newProduct: Product = {
      id: Date.now(),
      name,
      measure,
      quantity: quantity ?? 1,
      price: +price, // Ensure price is a number
      perecible,
      validityDate: validityDate ? new Date(validityDate) : undefined,
      fabricationDate: fabricationDate ? new Date(fabricationDate) : undefined
    };

    this.productService.addProduct(newProduct);
    this.router.navigate(['/products']);
  }

  getUnitSuffix(): string {
    const measure = this.form.get('measure')?.value;
    switch (measure) {
      case Measure.Liter:
        return 'lt';
      case Measure.Kilogram:
        return 'kg';
      case Measure.Unit:
        return 'un';
      default:
        return '';
    }
  }

  getQuantityPlaceholder(): string {
    const measure = this.form.get('measure')?.value;
    switch (measure) {
      case Measure.Liter:
        return 'Enter quantity in liters';
      case Measure.Kilogram:
        return 'Enter quantity in kilograms';
      case Measure.Unit:
        return 'Enter quantity in units';
      default:
        return 'Enter quantity';
    }
  }

  isProductExpired(): boolean {
    const validityDate = this.form.get('validityDate')?.value;
    if (validityDate) {
      const today = new Date();
      return new Date(validityDate) < today;
    }
    return false;
  }

  getValidityDateFormatted(): string {
    const validityDate = this.form.get('validityDate')?.value;
    return this.datePipe.transform(validityDate, 'dd/MM/yyyy') || '';
  }
}
