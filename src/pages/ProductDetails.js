import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProducts } from '../firebase';

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  const loadProduct = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getProducts();
      
      if (result.success) {
        const foundProduct = result.products.find(p => p.id === productId);
        if (foundProduct) {
          setProduct(foundProduct);
        }
      }
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  const handleAddToCart = async () => {
    if (!selectedColor || !selectedSize) {
      alert('Please select color and size first');
      return;
    }

    setAddingToCart(true);
    
    try {
      // Get existing cart items
      const existingCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
      
      // Create new cart item
      const cartItem = {
        id: `${product.id}_${selectedColor}_${selectedSize}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        color: selectedColor,
        size: selectedSize,
        quantity: 1
      };
      
      // Check if item already exists
      const existingItemIndex = existingCart.findIndex(item => item.id === cartItem.id);
      
      if (existingItemIndex !== -1) {
        // Update quantity if item exists
        existingCart[existingItemIndex].quantity += 1;
      } else {
        // Add new item
        existingCart.push(cartItem);
      }
      
      // Save to localStorage
      localStorage.setItem('cartItems', JSON.stringify(existingCart));
      
      // Trigger cart update event
      window.dispatchEvent(new Event('cartUpdated'));
      
      alert(`${product.name} (${selectedColor}, ${selectedSize}) has been added to cart successfully!`);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding product to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const isAddToCartDisabled = !selectedColor || !selectedSize || addingToCart;

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-5 text-center">
        <h2>Product Not Found</h2>
        <button className="btn btn-primary mt-3" onClick={() => navigate('/products')}>
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <button 
              className="btn btn-link p-0 text-decoration-none" 
              onClick={() => navigate('/')}
            >
              Home
            </button>
          </li>
          <li className="breadcrumb-item">
            <button 
              className="btn btn-link p-0 text-decoration-none" 
              onClick={() => navigate('/products')}
            >
              Products
            </button>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="row g-5">
        {/* Left Side - Product Image */}
        <div className="col-lg-6">
          <div className="product-image-container">
            <div className="main-image position-relative">
              <img
                src={product.image}
                alt={product.name}
                className="img-fluid rounded-3 shadow-lg"
                style={{ 
                  width: '100%', 
                  height: '600px', 
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease'
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Side - Product Info */}
        <div className="col-lg-6">
          <div className="product-info">
            {/* Product Name */}
            <h1 className="display-5 fw-bold mb-3 text-dark">{product.name}</h1>

            {/* Price */}
            <div className="mb-4">
              <span className="display-6 text-success fw-bold">{product.price} LE</span>
            </div>

            {/* Description */}
            <div className="mb-4">
              <h5 className="fw-bold mb-3 text-primary">Product Description</h5>
              <p className="text-muted fs-6 lh-lg">{product.description}</p>
            </div>

            {/* Colors Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-4">
                <h5 className="fw-bold mb-3 text-primary">
                  Choose Color <span className="text-danger">*</span>
                </h5>
                <div className="d-flex flex-wrap gap-2">
                  {product.colors.map((color, index) => (
                    <button
                      key={index}
                      className={`btn btn-outline-dark ${selectedColor === color ? 'active' : ''}`}
                      onClick={() => setSelectedColor(color)}
                      style={{
                        minWidth: '100px',
                        border: selectedColor === color ? '2px solid #0d6efd' : '1px solid #dee2e6',
                        backgroundColor: selectedColor === color ? '#0d6efd' : 'white',
                        color: selectedColor === color ? 'white' : '#212529'
                      }}
                    >
                      {color}
                    </button>
                  ))}
                </div>
                {selectedColor && (
                  <div className="mt-2">
                    <small className="text-success">
                      <i className="fas fa-check me-1"></i>
                      Selected: <strong>{selectedColor}</strong>
                    </small>
                  </div>
                )}
                {!selectedColor && (
                  <div className="mt-2">
                    <small className="text-danger">
                      <i className="fas fa-exclamation-triangle me-1"></i>
                      Please select a color
                    </small>
                  </div>
                )}
              </div>
            )}

            {/* Sizes Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-4">
                <h5 className="fw-bold mb-3 text-primary">
                  Choose Size <span className="text-danger">*</span>
                </h5>
                <div className="d-flex flex-wrap gap-2">
                  {product.sizes.map((size, index) => (
                    <button
                      key={index}
                      className={`btn btn-outline-dark ${selectedSize === size ? 'active' : ''}`}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        minWidth: '60px',
                        height: '50px',
                        border: selectedSize === size ? '2px solid #0d6efd' : '1px solid #dee2e6',
                        backgroundColor: selectedSize === size ? '#0d6efd' : 'white',
                        color: selectedSize === size ? 'white' : '#212529'
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {selectedSize && (
                  <div className="mt-2">
                    <small className="text-success">
                      <i className="fas fa-check me-1"></i>
                      Selected: <strong>{selectedSize}</strong>
                    </small>
                  </div>
                )}
                {!selectedSize && (
                  <div className="mt-2">
                    <small className="text-danger">
                      <i className="fas fa-exclamation-triangle me-1"></i>
                      Please select a size
                    </small>
                  </div>
                )}
              </div>
            )}

            {/* Add to Cart Button */}
            <div className="d-grid gap-2 mt-5">
              <button
                className={`btn btn-lg py-3 ${isAddToCartDisabled ? 'btn-secondary' : 'btn-success'}`}
                onClick={handleAddToCart}
                disabled={isAddToCartDisabled}
                style={{ fontSize: '1.1rem' }}
              >
                {addingToCart ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Adding to Cart...
                  </>
                ) : isAddToCartDisabled ? (
                  <>
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    Please Select Color and Size
                  </>
                ) : (
                  <>
                    <i className="fas fa-shopping-cart me-2"></i>
                    Add to Cart
                  </>
                )}
              </button>
              
              <button
                className="btn btn-outline-primary btn-lg"
                onClick={() => navigate('/products')}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
