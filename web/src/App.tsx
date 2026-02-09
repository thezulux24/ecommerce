import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { AdminLayout } from './admin/AdminLayout';
import { Dashboard } from './admin/Dashboard';
import { AdminProducts } from './admin/AdminProducts';
import { AdminCategories } from './admin/AdminCategories';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout children={<Dashboard />} />} />
      <Route path="/admin/products" element={<AdminLayout children={<AdminProducts />} />} />
      <Route path="/admin/categories" element={<AdminLayout children={<AdminCategories />} />} />

      {/* Otras rutas se añadirán después */}
    </Routes>
  );
}

export default App;
