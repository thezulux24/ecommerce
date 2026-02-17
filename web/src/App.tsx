import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Products } from './pages/Products';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Legal } from './pages/Legal';
import { Supplements } from './pages/Supplements';
import { Categories } from './pages/Categories';
import { Brands } from './pages/Brands';
import { SaveBundles } from './pages/SaveBundles';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminLayout } from './admin/AdminLayout';
import { Dashboard } from './admin/Dashboard';
import { AdminProducts } from './admin/AdminProducts';
import { AdminCategories } from './admin/AdminCategories';
import { AdminBrands } from './admin/AdminBrands';
import { AdminOrders } from './admin/AdminOrders';
import { AdminCustomers } from './admin/AdminCustomers';
import { AdminBundles } from './admin/AdminBundles';
import { StoreLayout } from './components/StoreLayout';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          {/* Rutas de Tienda */}
          <Route path="/" element={<StoreLayout><Home /></StoreLayout>} />
          <Route path="/products" element={<StoreLayout><Products /></StoreLayout>} />
          <Route path="/product/:slug" element={<StoreLayout><ProductDetail /></StoreLayout>} />
          <Route path="/cart" element={<StoreLayout><Cart /></StoreLayout>} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/legal" element={<StoreLayout><Legal /></StoreLayout>} />
          <Route path="/supplements" element={<StoreLayout><Supplements /></StoreLayout>} />
          <Route path="/categories" element={<StoreLayout><Categories /></StoreLayout>} />
          <Route path="/brands" element={<StoreLayout><Brands /></StoreLayout>} />
          <Route path="/save-bundles" element={<StoreLayout><SaveBundles /></StoreLayout>} />

          {/* Auth sin Layout publico */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas de Administración Protegidas */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly>
              <AdminLayout children={<Dashboard />} />
            </ProtectedRoute>
          } />
          <Route path="/admin/products" element={
            <ProtectedRoute adminOnly>
              <AdminLayout children={<AdminProducts />} />
            </ProtectedRoute>
          } />
          <Route path="/admin/categories" element={
            <ProtectedRoute adminOnly>
              <AdminLayout children={<AdminCategories />} />
            </ProtectedRoute>
          } />
          <Route path="/admin/brands" element={
            <ProtectedRoute adminOnly>
              <AdminLayout children={<AdminBrands />} />
            </ProtectedRoute>
          } />
          <Route path="/admin/orders" element={
            <ProtectedRoute adminOnly>
              <AdminLayout children={<AdminOrders />} />
            </ProtectedRoute>
          } />
          <Route path="/admin/customers" element={
            <ProtectedRoute adminOnly>
              <AdminLayout children={<AdminCustomers />} />
            </ProtectedRoute>
          } />
          <Route path="/admin/bundles" element={
            <ProtectedRoute adminOnly>
              <AdminLayout children={<AdminBundles />} />
            </ProtectedRoute>
          } />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
