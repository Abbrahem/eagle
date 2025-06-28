import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { addOrder } from '../firebase';

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    address: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadCartItems = useCallback(() => {
    try {
      const items = JSON.parse(localStorage.getItem('cartItems') || '[]');
      if (items.length === 0) {
        navigate('/cart');
        return;
      }
      setCartItems(items);
    } catch (error) {
      console.error('Error loading cart items:', error);
      navigate('/cart');
    }
  }, [navigate]);

  useEffect(() => {
    loadCartItems();
  }, [loadCartItems]);

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateShipping = () => {
    return 80; // Fixed shipping cost of 80 LE
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

  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!customerInfo.fullName.trim()) {
      alert('Please enter your full name');
      return;
    }
    
    if (!customerInfo.address.trim()) {
      alert('Please enter your detailed address');
      return;
    }
    
    if (!customerInfo.phone.trim()) {
      alert('Please enter your phone number');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        items: cartItems,
        customerInfo: {
          fullName: customerInfo.fullName.trim(),
          address: customerInfo.address.trim(),
          phone: `+20${customerInfo.phone.replace(/^\+?20/, '')}` // Ensure +20 prefix
        },
        subtotal: calculateSubtotal(),
        shippingCost: calculateShipping(),
        total: calculateTotal(),
        paymentMethod: 'Cash on Delivery',
        status: 'pending',
        orderDate: new Date().toISOString()
      };

      const result = await addOrder(orderData);
      
      if (result.success) {
        // Clear cart
        localStorage.removeItem('cartItems');
        window.dispatchEvent(new Event('cartUpdated'));
        
        alert(`Order confirmed successfully! Order ID: ${result.id}\n\nYour order will be delivered within 2-3 business days.\nTotal amount: ${calculateTotal()} LE`);
        navigate('/');
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
        <div className="text-center">
          <h3>No items in cart</h3>
          <button onClick={() => navigate('/cart')} className="btn btn-primary mt-3">
            Go to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Header */}
          <div className="text-center mb-4">
            <h1 className="display-5 fw-bold text-primary mb-2">
              <i className="fas fa-credit-card me-3"></i>
              Checkout
            </h1>
            <p className="lead text-muted">Complete your order details</p>
          </div>

          <div className="card shadow-lg border-0">
            <div className="card-body p-4">
              {/* Order Summary */}
              <div className="mb-4">
                <h5 className="fw-bold mb-3 text-primary">
                  <i className="fas fa-shopping-bag me-2"></i>
                  Order Summary
                </h5>
                
                <div className="bg-light rounded p-3 mb-3">
                  {cartItems.map((item, index) => (
                    <div key={`${item.id}-${item.selectedColor}-${item.selectedSize}`} 
                         className={`d-flex justify-content-between align-items-center ${index !== cartItems.length - 1 ? 'border-bottom pb-2 mb-2' : ''}`}>
                      <div className="d-flex align-items-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="rounded me-3"
                          style={{width: '50px', height: '50px', objectFit: 'cover'}}
                        />
                        <div>
                          <h6 className="mb-1">{item.name}</h6>
                          <small className="text-muted">
                            {item.selectedColor && <span className="badge bg-secondary me-1">{item.selectedColor}</span>}
                            {item.selectedSize && <span className="badge bg-secondary">{item.selectedSize}</span>}
                            <span className="ms-2">Qty: {item.quantity}</span>
                          </small>
                        </div>
                      </div>
                      <div className="text-end">
                        <strong>{(item.price * item.quantity).toFixed(0)} LE</strong>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="border-top pt-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <span>{calculateSubtotal().toFixed(0)} LE</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Shipping:</span>
                    <span>{calculateShipping()} LE</span>
                  </div>
                  <div className="d-flex justify-content-between border-top pt-2">
                    <strong className="h5">Total:</strong>
                    <strong className="h5 text-success">{calculateTotal().toFixed(0)} LE</strong>
                  </div>
                </div>
              </div>

              {/* Customer Information Form */}
              <form onSubmit={handleConfirmOrder}>
                <h5 className="fw-bold mb-3 text-primary">
                  <i className="fas fa-user me-2"></i>
                  Delivery Information
                </h5>

                {/* Full Name */}
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Full Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    name="fullName"
                    value={customerInfo.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                {/* Detailed Address */}
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Detailed Address <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control form-control-lg"
                    name="address"
                    value={customerInfo.address}
                    onChange={handleInputChange}
                    placeholder="Enter your complete address (Street, Building number, Floor, Apartment, City, Governorate)"
                    rows="4"
                    required
                  />
                  <div className="form-text">
                    Please provide your complete address including street name, building number, floor, apartment, city, and governorate.
                  </div>
                </div>

                {/* Phone Number */}
                <div className="mb-4">
                  <label className="form-label fw-bold">
                    Phone Number <span className="text-danger">*</span>
                  </label>
                  <div className="input-group input-group-lg">
                    <span className="input-group-text bg-primary text-white fw-bold">
                      <i className="fas fa-flag me-1"></i>
                      Egypt +20
                    </span>
                    <input
                      type="tel"
                      className="form-control"
                      name="phone"
                      value={customerInfo.phone}
                      onChange={handleInputChange}
                      placeholder="1012345678"
                      pattern="[0-9]{10}"
                      required
                    />
                  </div>
                  <div className="form-text">
                    Enter your 10-digit phone number without the country code
                  </div>
                </div>

                {/* Payment Method Info */}
                <div className="alert alert-info mb-4">
                  <div className="d-flex align-items-center">
                    <i className="fas fa-money-bill-wave fa-2x text-info me-3"></i>
                    <div>
                      <h6 className="alert-heading mb-1">Payment Method</h6>
                      <p className="mb-0">Cash on Delivery - Pay when you receive your order</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-success btn-lg py-3"
                    disabled={isSubmitting}
                    style={{ fontSize: '1.1rem' }}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Processing Order...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-check-circle me-2"></i>
                        Confirm Order ({calculateTotal().toFixed(0)} LE)
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-lg"
                    onClick={() => navigate('/cart')}
                    disabled={isSubmitting}
                  >
                    <i className="fas fa-arrow-left me-2"></i>
                    Back to Cart
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
