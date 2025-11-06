import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  productForm!: FormGroup;
  isEditMode = false;
  productId: string | null = null;
  categories: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private productService: ProductService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.fetchCategories();

    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.isEditMode = true;
      this.loadProductData(this.productId);
    }
  }

  initForm(): void {
    this.productForm = this.fb.group({
      categoryId: ['', Validators.required],
      product_name: ['', Validators.required],
      production_year: ['', [Validators.required, Validators.min(2000)]],
      price: ['', [Validators.required, Validators.min(1)]],
      expiry: ['', Validators.required],
      isavailble: [false],
      types: this.fb.array([])
    });
  }

  get types(): FormArray {
    return this.productForm.get('types') as FormArray;
  }

  addType(): void {
    this.types.push(this.fb.control(''));
  }

  removeType(index: number): void {
    this.types.removeAt(index);
  }

  fetchCategories(): void {
    this.http.get<any[]>('https://690843b7b49bea95fbf2de93.mockapi.io/api/vendors/categories')
      .subscribe({
        next: (res) => this.categories = res,
        error: (err) => console.error('Error fetching categories:', err)
      });
  }

  loadProductData(id: string): void {
    this.productService.getProductById(id).subscribe({
      next: (data) => {
        this.productForm.patchValue({
          categoryId: data.categoryId,
          product_name: data.product_name,
          production_year: data.production_year,
          price: data.price,
          expiry: data.expiry,
          isavailble: data.isavailble
        });

        this.types.clear();
        data.types?.forEach((t: string) => this.types.push(this.fb.control(t)));
      },
      error: (err) => console.error('Error loading product:', err)
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) return;

    const formData = this.productForm.value;

    if (this.isEditMode && this.productId) {
      this.productService.updateProduct(this.productId, formData).subscribe({
        next: () => {
          alert('Product updated successfully!');
          this.router.navigate(['/starter/products']);
        },
        error: (err) => console.error('Error updating product:', err)
      });
    } else {
      this.productService.addProduct(formData).subscribe({
        next: () => {
          alert('Product added successfully!');
          this.router.navigate(['/starter/products']);
        },
        error: (err) => console.error('Error adding product:', err)
      });
    }
  }
}
