import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, subscribeToProducts } from '../firebase';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const getCategoryLabel = (category) => {
    const categoryLabels = {
      't-shirts': 'T-Shirts',
      'shirts': 'Shirts',
      'pants': 'Pants',
      'dresses': 'Dresses',
      'shoes': 'Shoes',
      'accessories': 'Accessories',
      't-shirt': 'T-Shirts'
    };
    return categoryLabels[category] || category;
  };

  // Function to get category path elements for navigation
  const getCategoryPathElements = (category) => {
    return [
      { label: 'Home', path: '/' },
      { label: 'Products', path: '/products' },
      { label: getCategoryLabel(category), path: `/category/${category}` }
    ];
  };

  const categories = useMemo(() => [
    { value: 'all', label: 'All Products' },
    { value: 't-shirt', label: 'T-Shirts' },
    { value: 'pants', label: 'Pants' },
    { value: 'accessories', label: 'Accessories' }
  ], []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      console.log('Loading products from Firebase...');
      
      const result = await getProducts();
      
      if (result.success && result.products && Array.isArray(result.products)) {
        console.log(`Successfully loaded ${result.products.length} products from Firebase`);
        setProducts(result.products);
        setFilteredProducts(result.products);
      } else {
        console.log('No products found in Firebase');
        setProducts([]);
        setFilteredProducts([]);
      }
        
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    
    // محاولة الاشتراك في التحديثات المباشرة
    let unsubscribe = null;
    try {
      if (typeof subscribeToProducts === 'function') {
        unsubscribe = subscribeToProducts((updatedProducts) => {
          console.log('Real-time update received:', updatedProducts.length, 'products');
          if (Array.isArray(updatedProducts)) {
            setProducts(updatedProducts);
            setFilteredProducts(updatedProducts);
          }
        });
        console.log('Real-time listener activated');
      }
    } catch (subscribeError) {
      console.log('Real-time subscription not available');
    }
    
    // التحديث التلقائي كل 10 ثواني
    const updateInterval = setInterval(() => {
      console.log('Auto-updating products...');
      loadProducts();
    }, 10000);
    
    return () => {
      clearInterval(updateInterval);
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  // Filter and sort products
  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  }, [products, selectedCategory, sortBy, searchTerm]);

  // Removed unused addToCart function - using "View Product" navigation instead

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{width: '3rem', height: '3rem'}}></div>
          <h4>Loading Products...</h4>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12 text-center">
          <h1 className="display-4 fw-bold text-primary mb-3">Our Products</h1>
          <p className="lead text-muted">Discover our amazing collection of high-quality products</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="row mb-4">
        <div className="col-12 col-md-6 col-lg-4 mb-3">
          <label className="form-label fw-bold">
            <i className="fas fa-search me-2"></i>
            Search Products
          </label>
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="Search by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="col-6 col-md-3 col-lg-4 mb-3">
          <label className="form-label fw-bold">
            <i className="fas fa-th-large me-2"></i>
            Category
          </label>
          <select
            className="form-select form-select-lg"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="col-6 col-md-3 col-lg-4 mb-3">
          <label className="form-label fw-bold">
            <i className="fas fa-sort me-2"></i>
            Sort By
          </label>
          <select
            className="form-select form-select-lg"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Name (A-Z)</option>
            <option value="price-low">Price (Low to High)</option>
            <option value="price-high">Price (High to Low)</option>
          </select>
        </div>
      </div>

      {/* Results Info */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
            <div>
              <p className="text-muted mb-1 fw-semibold">
                Showing {filteredProducts.length} of {products.length} products
                {selectedCategory !== 'all' && ` in ${categories.find(c => c.value === selectedCategory)?.label}`}
                {searchTerm && ` matching "${searchTerm}"`}
              </p>
              <small className="text-success">
                <i className="fas fa-wifi me-1"></i>
                Live updates enabled
              </small>
            </div>
            <button 
              className="btn btn-outline-primary"
              onClick={loadProducts}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  <span className="d-none d-sm-inline">Loading...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-sync-alt me-2"></i>
                  <span className="d-none d-sm-inline">Refresh Now</span>
                  <span className="d-inline d-sm-none">Refresh</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-5">
          <i className="fas fa-box-open fa-5x text-muted mb-4"></i>
          <h3 className="text-muted mb-3">
            {products.length === 0 ? "No Products Available" : "No Products Found"}
          </h3>
          <p className="text-muted mb-4">
            {products.length === 0 
              ? "No products have been added yet." 
              : "Try adjusting your search criteria or browse all categories."
            }
          </p>
          
          <div className="d-flex gap-3 justify-content-center">
            {products.length === 0 ? (
              <button
                className="btn btn-primary btn-lg"
                onClick={loadProducts}
                disabled={loading}
              >
                <i className="fas fa-sync-alt me-2"></i>
                Check for Products
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="row g-3 g-md-4">
          {filteredProducts.map(product => (
            <div key={product.id} className="col-12 col-sm-6 col-lg-4 col-xl-3 mb-4">
              <div className="card h-100 shadow-sm border-0 product-card">
                <div className="position-relative overflow-hidden">
                  <div className="card-img-container d-flex align-items-center justify-content-center bg-light position-relative" style={{height: '250px', padding: '15px'}}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-image"
                      style={{
                        maxWidth: '100%', 
                        maxHeight: '100%', 
                        objectFit: 'contain',
                        borderRadius: '8px',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </div>
                  <div className="position-absolute top-0 end-0 p-2">
                    <span className="badge bg-primary">{getCategoryLabel(product.category)}</span>
                  </div>
                </div>
                
                <div className="card-body d-flex flex-column">
                  {/* Category Path */}
                  <div className="mb-2">
                    <nav aria-label="product-breadcrumb">
                      <ol className="breadcrumb mb-0" style={{fontSize: '0.75rem'}}>
                        {getCategoryPathElements(product.category).map((item, index) => (
                          <li key={index} className={`breadcrumb-item ${index === getCategoryPathElements(product.category).length - 1 ? 'active' : ''}`}>
                            {index === getCategoryPathElements(product.category).length - 1 ? (
                              <span className="text-primary fw-bold">{item.label}</span>
                            ) : (
                              <Link to={item.path} className="text-decoration-none text-muted">
                                {item.label}
                              </Link>
                            )}
                          </li>
                        ))}
                      </ol>
                    </nav>
                  </div>

                  <div className="mb-3">
                    <h5 className="card-title fw-bold mb-2 text-truncate" title={product.name}>
                      {product.name}
                    </h5>
                    <div className="h5 text-success fw-bold mb-0">
                      {product.price} <small className="text-muted">LE</small>
                    </div>
                  </div>
                  
                  <p className="card-text text-muted flex-grow-1">
                    {product.description && product.description.length > 80 
                      ? product.description.substring(0, 80) + '...' 
                      : product.description
                    }
                  </p>
                  
                  <div className="mb-3">
                    {/* Colors Preview */}
                    {product.colors && product.colors.length > 0 && (
                      <div className="mb-2">
                        <small className="text-muted fw-bold">Available Colors:</small>
                        <div className="d-flex flex-wrap gap-1 mt-1">
                          {product.colors.slice(0, 3).map((color, index) => (
                            <span key={index} className="badge bg-light text-dark border">
                              {color}
                            </span>
                          ))}
                          {product.colors.length > 3 && (
                            <span className="badge bg-secondary">
                              +{product.colors.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Sizes Preview */}
                    {product.sizes && product.sizes.length > 0 && (
                      <div className="mb-2">
                        <small className="text-muted fw-bold">Available Sizes:</small>
                        <div className="d-flex flex-wrap gap-1 mt-1">
                          {product.sizes.slice(0, 4).map((size, index) => (
                            <span key={index} className="badge bg-light text-dark border">
                              {size}
                            </span>
                          ))}
                          {product.sizes.length > 4 && (
                            <span className="badge bg-secondary">
                              +{product.sizes.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-auto">
                    <Link
                      to={`/product/${product.id}`}
                      className="btn btn-primary w-100"
                    >
                      <i className="fas fa-eye me-2"></i>
                      <span className="d-none d-sm-inline">View Product</span>
                      <span className="d-inline d-sm-none">View</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .product-card {
          transition: all 0.3s ease;
          border-radius: 1rem;
          overflow: hidden;
        }
        
        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.1) !important;
        }
        
        .product-card:hover .product-image {
          transform: scale(1.05);
        }
        
        .card-img-container {
          border-radius: 1rem 1rem 0 0;
        }
        
        .form-control-lg, .form-select-lg {
          border-radius: 0.75rem;
          border: 2px solid #e5e7eb;
          transition: all 0.3s ease;
        }
        
        .form-control-lg:focus, .form-select-lg:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 0.2rem rgba(37, 99, 235, 0.25);
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          border: none;
          border-radius: 0.75rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        
        .btn-primary:hover {
          background: linear-gradient(135deg, #1d4ed8, #2563eb);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
        }
        
        .btn-outline-primary {
          border: 2px solid #2563eb;
          color: #2563eb;
          border-radius: 0.75rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        
        .btn-outline-primary:hover {
          background: #2563eb;
          border-color: #2563eb;
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(37, 99, 235, 0.3);
        }
        
        /* Mobile Responsive Styles */
        @media (max-width: 576px) {
          .container {
            padding-left: 1rem;
            padding-right: 1rem;
          }
          
          .form-control-lg, .form-select-lg {
            font-size: 1rem;
            padding: 0.75rem 1rem;
          }
          
          .card-title {
            font-size: 1.1rem;
            line-height: 1.3;
          }
          
          .h1 {
            font-size: 1.75rem;
          }
          
          .h5 {
            font-size: 1.15rem;
          }
          
          .btn {
            padding: 0.75rem 1rem;
            font-size: 0.9rem;
          }
          
          .product-card {
            margin-bottom: 1.5rem !important;
          }
          
          .card-img-container {
            height: 200px !important;
            padding: 10px !important;
          }
          
          .form-label {
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
          }
          
          .card-body {
            padding: 1rem;
          }
        }
        
        /* Extra small mobile screens */
        @media (max-width: 480px) {
          .card-img-container {
            height: 180px !important;
          }
          
          .card-text {
            font-size: 0.9rem;
          }
          
          .breadcrumb {
            font-size: 0.7rem !important;
          }
          
          .badge {
            font-size: 0.7rem;
            padding: 0.25rem 0.5rem;
          }
        }
        
        /* Tablet styles */
        @media (min-width: 768px) and (max-width: 991.98px) {
          .product-card:hover {
            transform: translateY(-5px);
          }
          
          .col-md-6:nth-child(even) .product-card {
            margin-right: 0;
          }
        }
        
        /* Large screens optimization */
        @media (min-width: 1200px) {
          .product-card {
            border-radius: 1.25rem;
          }
          
          .card-img-container {
            height: 280px !important;
            padding: 20px !important;
          }
        }
        
        /* Touch device optimization */
        @media (hover: none) {
          .product-card:hover {
            transform: none;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important;
          }
          
          .product-card:hover .product-image {
            transform: none;
          }
          
          .btn-primary:hover, .btn-outline-primary:hover {
            transform: none;
          }
        }
        
        /* Grid spacing improvements */
        .row.g-3 > * {
          padding-left: 0.75rem;
          padding-right: 0.75rem;
        }
        
        .row.g-md-4 > * {
          @media (min-width: 768px) {
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Products; 