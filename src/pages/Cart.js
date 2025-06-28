import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createOrder } from '../utils/cartUtils';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = () => {
    try {
      const items = JSON.parse(localStorage.getItem('cartItems') || '[]');
      setCartItems(items);
    } catch (error) {
      console.error('Error loading cart items:', error);
      setCartItems([]);
    }
  };

  const updateCartItems = (newItems) => {
    setCartItems(newItems);
    localStorage.setItem('cartItems', JSON.stringify(newItems));
    
    // Dispatch custom event to update navbar counter
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const updateQuantity = (id, selectedColor, selectedSize, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(id, selectedColor, selectedSize);
      return;
    }

    const updatedItems = cartItems.map(item => {
      if (item.id === id && 
          item.selectedColor === selectedColor && 
          item.selectedSize === selectedSize) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    updateCartItems(updatedItems);
  };

  const removeItem = (id, selectedColor, selectedSize) => {
    const updatedItems = cartItems.filter(item => 
      !(item.id === id && 
        item.selectedColor === selectedColor && 
        item.selectedSize === selectedSize)
    );
    updateCartItems(updatedItems);
  };

  const clearCart = () => {
    if (window.confirm('Are you sure you want to clear the cart?')) {
      updateCartItems([]);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateShipping = () => {
    return 80; // Fixed shipping cost of 80 LE for all orders
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderData = {
        items: cartItems,
        customerInfo,
        subtotal: calculateSubtotal(),
        shippingCost: calculateShipping(),
        total: calculateTotal(),
        paymentMethod: 'Cash on Delivery'
      };

      const result = await createOrder(orderData);
      
      if (result.success) {
        alert('Order placed successfully! Order ID: ' + result.orderId);
        updateCartItems([]); // Clear cart
        setShowCheckoutModal(false);
        setCustomerInfo({ name: '', email: '', phone: '', address: '' });
      } else {
        alert('Failed to place order: ' + result.error);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <div className="card border-0 shadow-sm">
              <div className="card-body py-5">
                <i className="fas fa-shopping-cart fa-5x text-muted mb-4"></i>
                <h2 className="fw-bold mb-3">Your cart is empty</h2>
                <p className="text-muted mb-4">
                  Looks like you haven't added any items to your cart yet.
                </p>
                <Link to="/products" className="btn btn-primary btn-lg">
                  <i className="fas fa-shopping-bag me-2"></i>
                  Start Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="display-4 fw-bold text-primary mb-2">
            <i className="fas fa-shopping-cart me-3"></i>
            Shopping Cart
          </h1>
          <p className="lead text-muted">Review your items and proceed to checkout</p>
        </div>
      </div>

      <div className="row">
        {/* Cart Items */}
        <div className="col-lg-8 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold">
                  <i className="fas fa-list me-2"></i>
                  Cart Items ({cartItems.length})
                </h5>
                <button
                  onClick={clearCart}
                  className="btn btn-outline-danger btn-sm"
                >
                  <i className="fas fa-trash me-1"></i>
                  Clear Cart
                </button>
              </div>
            </div>
            
            <div className="card-body p-0">
              {cartItems.map((item, index) => (
                <div key={`${item.id}-${item.selectedColor}-${item.selectedSize}`} 
                     className={`p-4 ${index !== cartItems.length - 1 ? 'border-bottom' : ''}`}>
                  <div className="row align-items-center">
                    <div className="col-md-2 mb-3 mb-md-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="img-fluid rounded"
                        style={{height: '80px', objectFit: 'cover'}}
                      />
                    </div>
                    
                    <div className="col-md-4 mb-3 mb-md-0">
                      <h6 className="fw-bold mb-1">{item.name}</h6>
                      <div className="text-muted small">
                        {item.selectedColor && (
                          <span className="badge bg-secondary me-1">{item.selectedColor}</span>
                        )}
                        {item.selectedSize && (
                          <span className="badge bg-secondary">{item.selectedSize}</span>
                        )}
                      </div>
                      <div className="text-success fw-bold mt-1">
                        {item.price} LE each
                      </div>
                    </div>
                    
                    <div className="col-md-3 mb-3 mb-md-0">
                      <div className="d-flex align-items-center">
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => updateQuantity(item.id, item.selectedColor, item.selectedSize, item.quantity - 1)}
                        >
                          <i className="fas fa-minus"></i>
                        </button>
                        
                        <span className="mx-3 fw-bold">{item.quantity}</span>
                        
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => updateQuantity(item.id, item.selectedColor, item.selectedSize, item.quantity + 1)}
                        >
                          <i className="fas fa-plus"></i>
                        </button>
                      </div>
                    </div>
                    
                    <div className="col-md-2 mb-3 mb-md-0">
                      <div className="text-success fw-bold fs-5">
                        {(item.price * item.quantity)} LE
                      </div>
                    </div>
                    
                    <div className="col-md-1">
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => removeItem(item.id, item.selectedColor, item.selectedSize)}
                        title="Remove item"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="col-lg-4">
          <div className="card shadow-sm sticky-top" style={{top: '20px'}}>
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0 fw-bold">
                <i className="fas fa-calculator me-2"></i>
                Order Summary
              </h5>
            </div>
            
            <div className="card-body">
              <div className="d-flex justify-content-between mb-3">
                <span>Subtotal:</span>
                <span className="fw-bold">{calculateSubtotal()} LE</span>
              </div>
              
              <div className="d-flex justify-content-between mb-3">
                <span>Shipping:</span>
                <span className={`fw-bold ${calculateShipping() === 0 ? 'text-success' : ''}`}>
                  {calculateShipping() === 0 ? 'FREE' : `${calculateShipping()} LE`}
                </span>
              </div>
              
              {calculateShipping() === 0 && (
                <div className="alert alert-success py-2 mb-3">
                  <i className="fas fa-truck me-2"></i>
                  Free shipping on orders over 500 LE!
                </div>
              )}
              
              <hr />
              
              <div className="d-flex justify-content-between mb-4">
                <span className="fs-5 fw-bold">Total:</span>
                <span className="fs-4 fw-bold text-success">{calculateTotal()} LE</span>
              </div>
              
              <Link
                to="/checkout"
                className="btn btn-success btn-lg w-100 mb-3 text-decoration-none"
              >
                <i className="fas fa-credit-card me-2"></i>
                Proceed to Checkout
              </Link>
              
              <Link to="/products" className="btn btn-outline-primary w-100">
                <i className="fas fa-arrow-left me-2"></i>
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title fw-bold">
                  <i className="fas fa-user me-2"></i>
                  Customer Information
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowCheckoutModal(false)}
                ></button>
              </div>
              
              <form onSubmit={handleCheckout}>
                <div className="modal-body p-4">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">Full Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={customerInfo.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">Email *</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={customerInfo.email}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your email"
                      />
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">Phone Number *</label>
                      <input
                        type="tel"
                        className="form-control"
                        name="phone"
                        value={customerInfo.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your phone number"
                      />
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">Payment Method</label>
                      <input
                        type="text"
                        className="form-control"
                        value="Cash on Delivery"
                        disabled
                      />
                    </div>
                    
                    <div className="col-12 mb-3">
                      <label className="form-label fw-bold">Delivery Address *</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        name="address"
                        value={customerInfo.address}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your full delivery address"
                      ></textarea>
                    </div>
                  </div>
                  
                  {/* Order Summary in Modal */}
                  <div className="bg-light p-3 rounded">
                    <h6 className="fw-bold mb-3">Order Summary</h6>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Subtotal:</span>
                      <span>{calculateSubtotal()} LE</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Shipping:</span>
                      <span>{calculateShipping() === 0 ? 'FREE' : `${calculateShipping()} LE`}</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between fw-bold text-success">
                      <span>Total:</span>
                      <span>{calculateTotal()} LE</span>
                    </div>
                  </div>
                </div>
                
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowCheckoutModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Placing Order...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-check me-2"></i>
                        Place Order
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart; 