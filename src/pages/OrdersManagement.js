import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders, updateOrderStatus, addSampleOrders } from '../firebase';

const OrdersManagement = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const orderStatuses = [
    { value: '', label: 'All Orders' },
    { value: 'pending', label: 'Pending', color: 'warning' },
    { value: 'processing', label: 'Processing', color: 'info' },
    { value: 'shipped', label: 'Shipped', color: 'primary' },
    { value: 'delivered', label: 'Delivered', color: 'success' },
    { value: 'cancelled', label: 'Cancelled', color: 'danger' }
  ];

  // Check if admin is logged in and load orders
  useEffect(() => {
    const adminLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!adminLoggedIn) {
      navigate('/secret-admin-panel');
    } else {
      loadOrders();
    }
  }, [navigate]);

  // Load orders from Firebase
  const loadOrders = async () => {
    try {
      setLoading(true);
      const result = await getOrders();
      
      if (result.success) {
        // Sort orders by date (newest first)
        const sortedOrders = result.orders.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedOrders);
        setFilteredOrders(sortedOrders);
      } else {
        console.error('Error loading orders:', result.error);
        alert('Error loading orders');
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      alert('Error loading orders');
    } finally {
      setLoading(false);
    }
  };

  // Filter orders based on search and status
  useEffect(() => {
    let filtered = orders;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.customerInfo.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerInfo.phone.includes(searchTerm) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (selectedStatus) {
      filtered = filtered.filter(order => order.status === selectedStatus);
    }

    setFilteredOrders(filtered);
  }, [searchTerm, selectedStatus, orders]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const result = await updateOrderStatus(orderId, newStatus);
      if (result.success) {
        alert('Order status updated successfully!');
        loadOrders(); // Reload orders
      } else {
        alert('Failed to update order status: ' + result.error);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status');
    }
  };

  const handleAddSampleOrders = async () => {
    try {
      const result = await addSampleOrders();
      if (result.success) {
        alert('Sample orders added successfully!');
        loadOrders(); // Reload orders
      } else {
        alert('Failed to add sample orders');
      }
    } catch (error) {
      console.error('Error adding sample orders:', error);
      alert('Error adding sample orders');
    }
  };

  const getStatusBadge = (status) => {
    const statusObj = orderStatuses.find(s => s.value === status);
    return statusObj ? statusObj : { label: status, color: 'secondary' };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateOrderTotal = (order) => {
    const itemsTotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return itemsTotal + order.shippingCost;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{width: '3rem', height: '3rem'}}></div>
          <h4>Loading Orders...</h4>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="display-4 fw-bold text-primary mb-2">
                <i className="fas fa-clipboard-list me-3"></i>
                Orders Management
              </h1>
              <p className="lead text-muted mb-0">Track and manage customer orders</p>
            </div>
            <button
              onClick={() => navigate('/admin-dashboard')}
              className="btn btn-outline-secondary btn-lg"
            >
              <i className="fas fa-arrow-left me-2"></i>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card bg-primary text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Total Orders</h6>
                  <h2 className="fw-bold">{orders.length}</h2>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-shopping-bag fa-2x opacity-75"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card bg-warning text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Pending Orders</h6>
                  <h2 className="fw-bold">
                    {orders.filter(order => order.status === 'pending').length}
                  </h2>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-clock fa-2x opacity-75"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card bg-success text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Completed Orders</h6>
                  <h2 className="fw-bold">
                    {orders.filter(order => order.status === 'delivered').length}
                  </h2>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-check-circle fa-2x opacity-75"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card bg-info text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Total Revenue</h6>
                  <h2 className="fw-bold">
                    {orders
                      .filter(order => order.status === 'delivered')
                      .reduce((sum, order) => sum + calculateOrderTotal(order), 0)
                      .toFixed(0)} LE
                  </h2>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-dollar-sign fa-2x opacity-75"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">
                <i className="fas fa-search me-2"></i>
                Search Orders
              </label>
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Search by customer name, phone, or order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">
                <i className="fas fa-filter me-2"></i>
                Filter by Status
              </label>
              <select
                className="form-select form-select-lg"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {orderStatuses.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-5">
          <div className="mb-4">
            <i className="fas fa-clipboard-list fa-5x text-muted mb-3"></i>
            <h3 className="text-muted">No Orders Found</h3>
            <p className="lead text-muted">
              {orders.length === 0 
                ? "No orders have been placed yet." 
                : "No orders match your search criteria."
              }
            </p>
          </div>
          {orders.length === 0 && (
            <button
              onClick={handleAddSampleOrders}
              className="btn btn-outline-primary btn-lg"
            >
              <i className="fas fa-plus me-2"></i>
              Add Sample Orders for Testing
            </button>
          )}
        </div>
      ) : (
        <div className="row">
          {filteredOrders.map(order => (
            <div key={order.id} className="col-12 mb-4">
              <div className="card shadow-sm hover-lift">
                <div className="card-header bg-light">
                  <div className="row align-items-center">
                    <div className="col-md-6">
                      <h5 className="mb-1 fw-bold">
                        <i className="fas fa-receipt me-2"></i>
                        Order #{order.id.substring(0, 8)}
                      </h5>
                      <small className="text-muted">
                        <i className="fas fa-calendar me-1"></i>
                        {formatDate(order.createdAt)}
                      </small>
                    </div>
                    <div className="col-md-6 text-md-end">
                      <span className={`badge bg-${getStatusBadge(order.status).color} fs-6 me-2`}>
                        {getStatusBadge(order.status).label}
                      </span>
                      <span className="h5 text-success fw-bold">
                        {calculateOrderTotal(order)} LE
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="card-body">
                  <div className="row">
                    {/* Customer Information */}
                    <div className="col-lg-4 mb-3">
                      <h6 className="fw-bold text-primary mb-3">
                        <i className="fas fa-user me-2"></i>
                        Customer Information
                      </h6>
                      <div className="mb-2">
                        <strong>Name:</strong> {order.customerInfo.fullName}
                      </div>
                      <div className="mb-2">
                        <strong>Phone:</strong> {order.customerInfo.phone}
                      </div>
                      <div className="mb-2">
                        <strong>Address:</strong> {order.customerInfo.address}
                      </div>
                      <div className="mb-2">
                        <strong>Payment:</strong> 
                        <span className="badge bg-info ms-2">
                          {order.paymentMethod}
                        </span>
                      </div>
                    </div>
                    
                    {/* Order Items */}
                    <div className="col-lg-5 mb-3">
                      <h6 className="fw-bold text-primary mb-3">
                        <i className="fas fa-shopping-cart me-2"></i>
                        Order Items ({order.items.length})
                      </h6>
                      <div className="order-items-list">
                        {order.items.map((item, index) => (
                          <div key={index} className="d-flex align-items-center mb-3 p-2 bg-light rounded">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="me-3 rounded"
                              style={{width: '50px', height: '50px', objectFit: 'cover'}}
                            />
                            <div className="flex-grow-1">
                              <div className="fw-bold">{item.name}</div>
                              <div className="text-muted small">
                                {item.selectedColor && (
                                  <span className="badge bg-secondary me-1">{item.selectedColor}</span>
                                )}
                                {item.selectedSize && (
                                  <span className="badge bg-secondary me-1">{item.selectedSize}</span>
                                )}
                              </div>
                              <div className="text-success fw-bold">
                                {item.quantity} × {item.price} LE = {(item.quantity * item.price)} LE
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Order Summary & Actions */}
                    <div className="col-lg-3 mb-3">
                      <h6 className="fw-bold text-primary mb-3">
                        <i className="fas fa-calculator me-2"></i>
                        Order Summary
                      </h6>
                      
                      <div className="order-summary">
                        <div className="d-flex justify-content-between mb-2">
                          <span>Subtotal:</span>
                          <span>{order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)} LE</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Shipping:</span>
                          <span>{order.shippingCost} LE</span>
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between fw-bold text-success">
                          <span>Total:</span>
                          <span>{calculateOrderTotal(order)} LE</span>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <label className="form-label fw-bold">Update Status:</label>
                        <select
                          className="form-select mb-3"
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        >
                          {orderStatuses.slice(1).map(status => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersManagement; 