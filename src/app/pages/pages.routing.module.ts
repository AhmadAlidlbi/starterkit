import { Routes } from '@angular/router';
import { ProductsComponent } from './products/products.component';
import { CatagoryComponent } from './catagory/catagory.component';
import { AddProductComponent } from './products/add-product/add-product.component';

export const PagesRoutes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full'
  },
  {
    path: 'products',
    component: ProductsComponent,
    data: { title: 'Products Page' }
  },
  {
    path: 'products/add',
    component: AddProductComponent,
    data: { title: 'Add Product' }
  },
  {
    path: 'products/edit/:id',
    component: AddProductComponent,
    data: { title: 'Edit Product' }
  },
  {
    path: 'catagory',
    component: CatagoryComponent,
    data: { title: 'Category Page' }
  }
];
