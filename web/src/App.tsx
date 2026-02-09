import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminLayout } from './admin/AdminLayout';
import { Dashboard } from './admin/Dashboard';
import { AdminProducts } from './admin/AdminProducts';
import { AdminCategories } from './admin/AdminCategories';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
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

        {/* Otras rutas se añadirán después */}
      </Routes>
    </AuthProvider>
  );
}

export default App;
