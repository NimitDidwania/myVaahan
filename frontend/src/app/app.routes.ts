import { Routes } from '@angular/router';
import { InvoicesComponent } from './invoices/invoices.component';
import { LoginComponent } from './login/login.component';
import { LedgerComponent } from './ledger/ledger.component';
import { HomeComponent } from './home/home.component';
import { SupplierComponent } from './supplier/supplier.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'invoices', component: InvoicesComponent },
    {path: 'ledger/:type/:id', component: LedgerComponent},
    {path: 'suppliers', component: SupplierComponent},
    { path: '**', redirectTo: '/login' } // Redirect to login for unknown paths
];
