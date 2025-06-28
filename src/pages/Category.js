import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductsByCategory } from '../firebase';

const Category = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('name');

  const getCategoryLabel = (category) => {
    const categoryLabels = {
      't-shirt': 'T-Shirts',
      'shirts': 'Shirts',
      'pants': 'Pants',
      'dresses': 'Dresses',
      'shoes': 'Shoes',
      'accessories': 'Accessories'
    };
    return categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1);
  };

  // Function to get category path elements for navigation
  const getCategoryPathElements = (category) => {
    return [
      { label: 'Home', path: '/' },
      { label: 'Products', path: '/products' },
      { label: getCategoryLabel(category), path: `/category/${category}` }
    ];
  };

  const categoryInfo = useMemo(() => ({
    't-shirt': {
      title: 'T-Shirts',
      description: 'Comfortable and stylish t-shirts for every occasion',
      icon: 'fas fa-tshirt'
    },
    'shirts': {
      title: 'Shirts',
      description: 'Professional and casual shirts for all occasions',
      icon: 'fas fa-user-tie'
    },
    'pants': {
      title: 'Pants',
      description: 'Premium quality pants and jeans',
      icon: 'fas fa-user-tie'
    },
    'dresses': {
      title: 'Dresses',
      description: 'Elegant dresses for special occasions',
      icon: 'fas fa-female'
    },
    'shoes': {
      title: 'Shoes',
      description: 'Comfortable shoes for every step',
      icon: 'fas fa-shoe-prints'
    },
    'accessories': {
      title: 'Accessories',
      description: 'Complete your look with our accessories',
      icon: 'fas fa-gem'
    }
  }), []);

  useEffect(() => {
    loadCategoryProducts();
  }, [categoryName]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadCategoryProducts = async () => {
    try {
      setLoading(true);
      console.log('Loading products for category:', categoryName); // Debug log
      const result = await getProductsByCategory(categoryName);
      
      if (result.success) {
        console.log('Products loaded for category', categoryName + ':', result.products.length, 'products'); // Debug log
        console.log('Products details:', result.products); // Debug log
        setProducts(result.products);
      } else {
        console.error('Error loading category products:', result.error);
        setProducts([]);
      }
    } catch (error) {
      console.error('Error loading category products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    sorted.sort((a, b) => {
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
    return sorted;
  }, [products, sortBy]);

  // Removed unused addToCart function - using "View Product" navigation instead

  const currentCategory = categoryInfo[categoryName];

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{width: '3rem', height: '3rem'}}></div>
          <h4>Loading {currentCategory?.title}...</h4>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/" className="text-decoration-none">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/products" className="text-decoration-none">Products</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {currentCategory?.title}
              </li>
            </ol>
          </nav>
          
          <div className="text-center">
            <div className="mb-3">
              <i className={`${currentCategory?.icon} fa-4x text-primary`}></i>
            </div>
            <h1 className="display-4 fw-bold text-primary mb-3">
              {currentCategory?.title}
            </h1>
            <p className="lead text-muted mb-4">
              {currentCategory?.description}
            </p>
            <p className="text-muted">
              {products.length} {products.length === 1 ? 'product' : 'products'} available
            </p>
          </div>
        </div>
      </div>

      {/* Sort Options */}
      {products.length > 0 && (
        <div className="row mb-4">
          <div className="col-md-6 offset-md-6">
            <div className="d-flex align-items-center">
              <label className="form-label fw-bold me-3 mb-0">Sort By:</label>
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Name (A-Z)</option>
                <option value="price-low">Price (Low to High)</option>
                <option value="price-high">Price (High to Low)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {sortedProducts.length === 0 ? (
        <div className="text-center py-5">
          <i className="fas fa-box-open fa-5x text-muted mb-4"></i>
          <h3 className="text-muted mb-3">No Products Available</h3>
          <p className="text-muted mb-4">
            We don't have any {currentCategory?.title.toLowerCase()} in stock right now.
          </p>
          <Link to="/products" className="btn btn-primary">
            <i className="fas fa-arrow-left me-2"></i>
            Browse All Products
          </Link>
        </div>
      ) : (
        <div className="row">
          {sortedProducts.map(product => (
            <div key={product.id} className="col-lg-4 col-md-6 mb-4">
              <div className="card h-100 shadow-sm hover-lift">
                <div className="position-relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="card-img-top"
                    style={{height: '280px', objectFit: 'cover', transition: 'transform 0.3s ease'}}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  />
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
                    <h5 className="card-title fw-bold mb-2">{product.name}</h5>
                    <div className="h4 text-success fw-bold mb-0">
                      {product.price} LE
                    </div>
                  </div>
                  
                  <p className="card-text text-muted flex-grow-1">
                    {product.description.length > 80 
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
                          {product.colors.slice(0, 3).map(color => (
                            <span key={color} className="badge bg-light text-dark border">
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
                          {product.sizes.slice(0, 4).map(size => (
                            <span key={size} className="badge bg-light text-dark border">
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
                      className="btn btn-primary w-100 btn-lg"
                    >
                      <i className="fas fa-eye me-2"></i>
                      View Product
                    </Link>
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

export default Category; 