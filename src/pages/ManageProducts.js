import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, deleteProduct, addSampleProducts } from '../firebase';

const ManageProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const getCategoryLabel = (category) => {
    const categoryLabels = {
      't-shirt': 'T-Shirts',
      'shirts': 'Shirts',
      'pants': 'Pants',
      'dresses': 'Dresses',
      'shoes': 'Shoes',
      'accessories': 'Accessories'
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
    { value: 'all', label: 'All Categories' },
    { value: 't-shirt', label: 'T-Shirts' },
    { value: 'pants', label: 'Pants' },
    { value: 'accessories', label: 'Accessories' }
  ], []);

  // Check if admin is logged in and load products
  useEffect(() => {
    const adminLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!adminLoggedIn) {
      navigate('/secret-admin-panel');
    } else {
      loadProducts();
    }
  }, [navigate]);  // eslint-disable-line react-hooks/exhaustive-deps

  // Load products from Firebase
  const loadProducts = async () => {
    try {
      setLoading(true);
      const result = await getProducts();
      
      if (result.success) {
        setProducts(result.products);
        setFilteredProducts(result.products);
        
        // If no products exist, offer to add sample data
        if (result.products.length === 0) {
          const addSample = window.confirm('No products found in database. Would you like to add sample data for testing?');
          if (addSample) {
            await handleAddSampleData();
          }
        }
      } else {
        console.error('Error loading products:', result.error);
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

  // Filter products
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
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.colors && product.colors.some(color => 
          color.toLowerCase().includes(searchTerm.toLowerCase())
        )) ||
        (product.sizes && product.sizes.some(size => 
          size.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchTerm]);

  const handleAddSampleData = async () => {
    try {
      setLoading(true);
      const result = await addSampleProducts();
      if (result.success) {
        console.log('Sample products added successfully');
        await loadProducts(); // Reload products after adding sample data
      } else {
        console.error('Error adding sample products:', result.error);
      }
    } catch (error) {
      console.error('Error adding sample products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (productId) => {
    navigate(`/edit-product/${productId}`);
  };

  const handleDelete = async (productId) => {
    const product = products.find(p => p.id === productId);
    
    const confirmMessage = `⚠️ WARNING: This action cannot be undone!\n\n` +
      `Are you absolutely sure you want to permanently delete:\n` +
      `"${product.name}"\n\n` +
      `This will remove the product from:\n` +
      `• Your inventory\n` +
      `• The website\n` +
      `• The database\n\n` +
      `Type "DELETE" to confirm:`;
    
    const userInput = prompt(confirmMessage);
    
    if (userInput === 'DELETE') {
      try {
        const result = await deleteProduct(productId);
        if (result.success) {
          alert('✅ Product deleted successfully!\nThe product has been permanently removed from your store.');
          loadProducts(); // Reload products
        } else {
          alert('❌ Failed to delete product: ' + result.error);
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('❌ Error deleting product. Please try again.');
      }
    } else if (userInput !== null) {
      alert('❌ Deletion cancelled. You must type "DELETE" exactly to confirm.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="display-4 fw-bold text-primary mb-2">
                <i className="fas fa-boxes me-3"></i>
                Product Management
              </h1>
              <p className="lead text-muted mb-0">Manage your store inventory</p>
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
                  <h6 className="card-title">Total Products</h6>
                  <h2 className="fw-bold">{products.length}</h2>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-box fa-2x opacity-75"></i>
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
                  <h6 className="card-title">Filtered Results</h6>
                  <h2 className="fw-bold">{filteredProducts.length}</h2>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-filter fa-2x opacity-75"></i>
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
                  <h6 className="card-title">Low Stock</h6>
                  <h2 className="fw-bold">{products.filter(p => p.stock < 10).length}</h2>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-exclamation-triangle fa-2x opacity-75"></i>
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
                  <h6 className="card-title">Total Value</h6>
                  <h2 className="fw-bold">
                    {products.reduce((total, product) => total + (product.price * product.stock), 0).toFixed(0)} LE
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
                Search Products
              </label>
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Search by name, description, ID, colors, or sizes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">
                <i className="fas fa-filter me-2"></i>
                Filter by Category
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
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-5">
          <div className="mb-4">
            <i className="fas fa-box-open fa-5x text-muted mb-3"></i>
            <h3 className="text-muted">No Products Found</h3>
            <p className="lead text-muted">
              {products.length === 0 
                ? "No products in your inventory yet." 
                : "No products match your search criteria."
              }
            </p>
          </div>
          {products.length === 0 && (
            <div className="d-flex gap-3 justify-content-center">
              <button
                onClick={() => navigate('/add-new-product')}
                className="btn btn-primary btn-lg"
              >
                <i className="fas fa-plus me-2"></i>
                Add First Product
              </button>
              <button
                onClick={handleAddSampleData}
                className="btn btn-outline-secondary btn-lg"
              >
                <i className="fas fa-database me-2"></i>
                Add Sample Data
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="row">
          {filteredProducts.map(product => (
            <div key={product.id} className="col-lg-4 col-md-6 mb-4">
              <div className="card h-100 shadow-sm hover-lift">
                <div className="position-relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="card-img-top"
                    style={{height: '250px', objectFit: 'cover'}}
                  />
                  <div className="position-absolute top-0 end-0 p-2">
                    <span className="badge bg-primary">
                      {getCategoryLabel(product.category)}
                    </span>
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
                              <span className="text-muted">{item.label}</span>
                            )}
                          </li>
                        ))}
                      </ol>
                    </nav>
                  </div>

                  <div className="mb-2">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className="badge bg-primary">{getCategoryLabel(product.category)}</span>
                      <small className="text-muted">ID: {product.id.substring(0, 8)}...</small>
                    </div>
                    <h5 className="card-title fw-bold">{product.name}</h5>
                  </div>
                  
                  <p className="card-text text-muted flex-grow-1">
                    {product.description.length > 100 
                      ? product.description.substring(0, 100) + '...' 
                      : product.description
                    }
                  </p>
                  
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="h4 text-success fw-bold mb-0">
                        {product.price} LE
                      </span>
                      <small className="text-muted">
                        {formatDate(product.createdAt)}
                      </small>
                    </div>
                    
                    {/* Stock Information */}
                    <div className="mb-2">
                      <small className="text-muted fw-bold">Stock:</small>
                      <span className={`badge ms-2 ${product.stock < 10 ? 'bg-danger' : product.stock < 20 ? 'bg-warning' : 'bg-success'}`}>
                        {product.stock || 0} units
                      </span>
                    </div>
                    
                    {/* Colors */}
                    {product.colors && product.colors.length > 0 && (
                      <div className="mb-2">
                        <small className="text-muted fw-bold">Colors:</small>
                        <div className="d-flex flex-wrap gap-1 mt-1">
                          {product.colors.map(color => (
                            <span key={color} className="badge bg-light text-dark border">
                              {color}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Sizes */}
                    {product.sizes && product.sizes.length > 0 && (
                      <div className="mb-2">
                        <small className="text-muted fw-bold">Sizes:</small>
                        <div className="d-flex flex-wrap gap-1 mt-1">
                          {product.sizes.map(size => (
                            <span key={size} className="badge bg-light text-dark border">
                              {size}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="d-flex flex-column gap-2">
                    <button
                      onClick={() => window.open(`/product/${product.id}`, '_blank')}
                      className="btn btn-outline-info btn-sm"
                      title="View this product on the website"
                    >
                      <i className="fas fa-external-link-alt me-1"></i>
                      View on Website
                    </button>
                    <div className="d-flex gap-2">
                      <button
                        onClick={() => handleEdit(product.id)}
                        className="btn btn-warning flex-fill"
                        title="Edit this product"
                      >
                        <i className="fas fa-edit me-1"></i>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="btn btn-danger flex-fill"
                        title="Delete this product permanently"
                      >
                        <i className="fas fa-trash me-1"></i>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Add Button */}
      <button
        onClick={() => navigate('/add-new-product')}
        className="btn btn-primary btn-lg rounded-circle position-fixed shadow-lg"
        style={{
          bottom: '30px',
          right: '30px',
          width: '60px',
          height: '60px',
          zIndex: 1000
        }}
        title="Add New Product"
      >
        <i className="fas fa-plus fa-lg"></i>
      </button>
    </div>
  );
};

export default ManageProducts; 