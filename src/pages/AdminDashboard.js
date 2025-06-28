import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getProducts, getOrders, addSampleProducts, addSampleOrders } from '../firebase';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is logged in
    const adminLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!adminLoggedIn) {
      navigate('/secret-admin-panel');
    }
    loadStats();
  }, [navigate]);

  const loadStats = async () => {
    try {
      setLoading(true);
      
      // Load products
      const productsResult = await getProducts();
      const products = productsResult.success ? productsResult.products : [];
      
      // Load orders
      const ordersResult = await getOrders();
      const orders = ordersResult.success ? ordersResult.orders : [];
      
      // Calculate stats
      const pendingOrders = orders.filter(order => order.status === 'pending').length;
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
      
      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        pendingOrders: pendingOrders,
        totalRevenue: totalRevenue
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSampleData = async () => {
    if (window.confirm('This will add sample products and orders to your database. Continue?')) {
      try {
        // Add sample products
        const productsResult = await addSampleProducts();
        if (productsResult.success) {
          console.log('Sample products added successfully');
        }
        
        // Add sample orders
        const ordersResult = await addSampleOrders();
        if (ordersResult.success) {
          console.log('Sample orders added successfully');
        }
        
        // Reload stats
        loadStats();
        alert('Sample data added successfully!');
      } catch (error) {
        console.error('Error adding sample data:', error);
        alert('Error adding sample data. Please try again.');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate('/secret-admin-panel');
  };

  return (
    <div className="min-vh-100" style={{backgroundColor: 'white'}}>
      {/* Header */}
      <div className="py-4" style={{backgroundColor: '#000000', color: 'var(--secondary-brown)'}}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 className="display-4 fw-bold mb-2">
                <i className="fas fa-tachometer-alt me-3"></i>
                Admin Dashboard
              </h1>
                              <p className="lead mb-0">Manage your store | نسر</p>
            </div>
            <div className="col-md-4 text-end">
              <button
                onClick={handleLogout}
                className="btn btn-lg"
                style={{
                  backgroundColor: 'var(--secondary-brown)',
                  borderColor: 'var(--secondary-brown)',
                  color: '#000'
                }}
              >
                <i className="fas fa-sign-out-alt me-2"></i>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="container py-5">
        <div className="row g-4">
          {/* Add New Product Card */}
          <div className="col-lg-4 col-md-6">
            <div 
              className="card h-100 shadow-sm hover-lift cursor-pointer"
              onClick={() => navigate('/add-new-product')}
              style={{ cursor: 'pointer' }}
            >
              <div className="card-body text-center p-5">
                <div className="mb-4">
                  <i className="fas fa-plus-circle fa-5x" style={{color: 'var(--secondary-brown)'}}></i>
                </div>
                <h3 className="card-title fw-bold mb-3" style={{color: 'var(--secondary-brown)'}}>Add New Product</h3>
                <p className="card-text text-muted">
                  Add new products to your store inventory with images, colors, and sizes
                </p>
                <div className="mt-4">
                  <span className="btn btn-lg" style={{backgroundColor: 'var(--secondary-brown)', borderColor: 'var(--secondary-brown)', color: '#000'}}>
                    <i className="fas fa-arrow-right me-2"></i>
                    Get Started
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Manage Products Card */}
          <div className="col-lg-4 col-md-6">
            <div 
              className="card h-100 shadow-sm hover-lift cursor-pointer"
              onClick={() => navigate('/manage-products')}
              style={{ cursor: 'pointer' }}
            >
              <div className="card-body text-center p-5">
                <div className="mb-4">
                  <i className="fas fa-boxes fa-5x" style={{color: 'var(--primary-brown)'}}></i>
                </div>
                <h3 className="card-title fw-bold mb-3" style={{color: 'var(--primary-brown)'}}>Manage Products</h3>
                <p className="card-text text-muted">
                  View, edit, and delete existing products in your inventory
                </p>
                <div className="mt-4">
                  <span className="btn btn-lg" style={{backgroundColor: 'var(--primary-brown)', borderColor: 'var(--primary-brown)', color: '#000'}}>
                    <i className="fas fa-arrow-right me-2"></i>
                    Manage Now
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Orders Management Card */}
          <div className="col-lg-4 col-md-6">
            <div 
              className="card h-100 shadow-sm hover-lift cursor-pointer"
              onClick={() => navigate('/orders-management')}
              style={{ cursor: 'pointer' }}
            >
              <div className="card-body text-center p-5">
                <div className="mb-4">
                  <i className="fas fa-clipboard-list fa-5x" style={{color: 'var(--accent-brown)'}}></i>
                </div>
                <h3 className="card-title fw-bold mb-3" style={{color: 'var(--accent-brown)'}}>Orders Management</h3>
                <p className="card-text text-muted">
                  Track and manage customer orders, update order status
                </p>
                <div className="mt-4">
                  <span className="btn btn-lg" style={{backgroundColor: 'var(--accent-brown)', borderColor: 'var(--accent-brown)', color: '#000'}}>
                    <i className="fas fa-arrow-right me-2"></i>
                    View Orders
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Store Statistics Card */}
          <div className="col-lg-6 col-md-6">
            <div className="card h-100 shadow-sm">
              <div className="card-body p-4">
                <h4 className="card-title fw-bold mb-4" style={{color: 'var(--secondary-brown)'}}>
                  <i className="fas fa-chart-bar me-2"></i>
                  Store Statistics
                </h4>
                <div className="row g-3">
                  <div className="col-6">
                    <div className="text-center p-3 rounded" style={{backgroundColor: 'rgba(218, 165, 32, 0.1)'}}>
                      <i className="fas fa-box fa-2x mb-2" style={{color: 'var(--secondary-brown)'}}></i>
                      <h4 className="fw-bold" style={{color: 'var(--secondary-brown)'}}>
                        {loading ? '...' : stats.totalProducts}
                      </h4>
                      <small style={{color: 'var(--primary-brown)'}}>Total Products</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="text-center p-3 rounded" style={{backgroundColor: 'rgba(218, 165, 32, 0.1)'}}>
                      <i className="fas fa-shopping-bag fa-2x mb-2" style={{color: 'var(--secondary-brown)'}}></i>
                      <h4 className="fw-bold" style={{color: 'var(--secondary-brown)'}}>{stats.totalOrders}</h4>
                      <small style={{color: 'var(--primary-brown)'}}>Total Orders</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="text-center p-3 rounded" style={{backgroundColor: 'rgba(218, 165, 32, 0.1)'}}>
                      <i className="fas fa-clock fa-2x mb-2" style={{color: 'var(--accent-brown)'}}></i>
                      <h4 className="fw-bold" style={{color: 'var(--accent-brown)'}}>{stats.pendingOrders}</h4>
                      <small style={{color: 'var(--primary-brown)'}}>Pending Orders</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="text-center p-3 rounded" style={{backgroundColor: 'rgba(218, 165, 32, 0.1)'}}>
                      <i className="fas fa-dollar-sign fa-2x mb-2" style={{color: 'var(--primary-brown)'}}></i>
                      <h4 className="fw-bold" style={{color: 'var(--primary-brown)'}}>{stats.totalRevenue.toLocaleString()} LE</h4>
                      <small style={{color: 'var(--primary-brown)'}}>Total Revenue</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="col-lg-6 col-md-6">
            <div className="card h-100 shadow-sm">
              <div className="card-body p-4">
                <h4 className="card-title fw-bold text-secondary mb-4">
                  <i className="fas fa-bolt me-2"></i>
                  Quick Actions
                </h4>
                <div className="d-grid gap-3">
                  <button 
                    className="btn btn-outline-primary btn-lg"
                    onClick={() => navigate('/')}
                  >
                    <i className="fas fa-home me-2"></i>
                    View Store Front
                  </button>
                  <button 
                    className="btn btn-outline-success btn-lg"
                    onClick={() => navigate('/products')}
                  >
                    <i className="fas fa-shopping-cart me-2"></i>
                    Browse Products
                  </button>
                  <button 
                    className="btn btn-outline-info btn-lg"
                    onClick={() => navigate('/cart')}
                  >
                    <i className="fas fa-shopping-bag me-2"></i>
                    View Shopping Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="card" style={{background: 'linear-gradient(135deg, #000000 0%, #333333 100%)', color: 'var(--secondary-brown)'}}>
              <div className="card-body text-center py-5">
                <h2 className="fw-bold mb-3">Welcome to store | نسر Admin Panel</h2>
                <p className="lead mb-4">
                  Manage your online store efficiently with our comprehensive admin tools
                </p>
                <div className="row justify-content-center">
                  <div className="col-md-8">
                    <div className="row g-4">
                      <div className="col-md-4">
                        <div className="text-center">
                          <i className="fas fa-shield-alt fa-3x mb-3 opacity-75"></i>
                          <h5>Secure</h5>
                          <p className="small opacity-75">Protected admin access</p>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="text-center">
                          <i className="fas fa-rocket fa-3x mb-3 opacity-75"></i>
                          <h5>Fast</h5>
                          <p className="small opacity-75">Quick product management</p>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="text-center">
                          <i className="fas fa-users fa-3x mb-3 opacity-75"></i>
                          <h5>User-Friendly</h5>
                          <p className="small opacity-75">Easy to use interface</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title fw-bold mb-4">
                  <i className="fas fa-bolt text-warning me-2"></i>
                  Quick Actions
                </h5>
                <div className="row g-3">
                  <div className="col-md-3">
                    <Link to="/add-product" className="btn btn-success w-100 py-3">
                      <i className="fas fa-plus-circle fa-2x d-block mb-2"></i>
                      <span className="fw-bold">Add New Product</span>
                    </Link>
                  </div>
                  <div className="col-md-3">
                    <Link to="/manage-products" className="btn btn-primary w-100 py-3">
                      <i className="fas fa-boxes fa-2x d-block mb-2"></i>
                      <span className="fw-bold">Manage Products</span>
                    </Link>
                  </div>
                  <div className="col-md-3">
                    <Link to="/orders" className="btn btn-info w-100 py-3">
                      <i className="fas fa-clipboard-list fa-2x d-block mb-2"></i>
                      <span className="fw-bold">View Orders</span>
                    </Link>
                  </div>
                  <div className="col-md-3">
                    <button onClick={handleAddSampleData} className="btn btn-warning w-100 py-3">
                      <i className="fas fa-database fa-2x d-block mb-2"></i>
                      <span className="fw-bold">Add Sample Data</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 