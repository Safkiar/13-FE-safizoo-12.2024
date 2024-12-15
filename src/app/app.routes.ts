import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';

export const routes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'cart-details', component: CartDetailsComponent },
  { path: 'products/:id', component: ProductDetailsComponent },
  { path: 'category', component: ProductListComponent }, // List all categories
  { path: 'category/:id', component: ProductListComponent }, // Show products in a specific category
  { path: 'products', component: ProductListComponent }, // List all products
  { path: 'search/:keyword', component: ProductListComponent },
  { path: '**', redirectTo: '/products', pathMatch: 'full' },
];
