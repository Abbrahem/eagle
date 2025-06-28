import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import components
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import Category from './pages/Category';
import ProductDetails from './pages/ProductDetails';
import Checkout from './pages/Checkout';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AddNewProduct from './pages/AddNewProduct';
import EditProduct from './pages/EditProduct';
import ManageProducts from './pages/ManageProducts';
import OrdersManagement from './pages/OrdersManagement';
import Cart from './pages/Cart';
import Footer from './components/Footer';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="App animate-slide-up">
        <Navbar />
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/category/:categoryName" element={<Category />} />
            <Route path="/product/:productId" element={<ProductDetails />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/secret-admin-panel" element={<AdminLogin />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/add-new-product" element={<AddNewProduct />} />
            <Route path="/edit-product/:productId" element={<EditProduct />} />
            <Route path="/manage-products" element={<ManageProducts />} />
            <Route path="/orders-management" element={<OrdersManagement />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App; 