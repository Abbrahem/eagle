import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProducts, updateProduct, uploadImageAsBase64 } from '../firebase';

const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [originalProduct, setOriginalProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    colors: [],
    sizes: [],
    image: null,
    imageId: '',
    stock: 0
  });
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Category options with colors and sizes
  const categoryOptions = {
    't-shirt': {
      label: 'T-Shirt',
      colors: ['White', 'Black', 'Blue', 'Brown', 'Red', 'Green', 'Gray', 'Navy'],
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    },
    'pants': {
      label: 'Pants',
      colors: ['Black', 'Blue', 'Brown', 'White', 'Light Gray', 'Dark Gray', 'Navy', 'Khaki'],
      sizes: ['30', '32', '34', '36', '38', '40', '42']
    },
    'accessories': {
      label: 'Accessories',
      colors: ['Black', 'Blue', 'Brown', 'White', 'Red', 'Gold', 'Silver'],
      sizes: ['One Size', 'Small', 'Medium', 'Large']
    }
  };

  const loadProduct = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getProducts();
      
      if (result.success) {
        const product = result.products.find(p => p.id === productId);
        if (product) {
          setOriginalProduct(product);
          setFormData({
            name: product.name || '',
            price: product.price || '',
            category: product.category || '',
            description: product.description || '',
            colors: product.colors || [],
            sizes: product.sizes || [],
            image: null, // Will be set only if user uploads new image
            imageId: product.imageId || '',
            stock: product.stock || 0
          });
          setImagePreview(product.image || null);
        } else {
          alert('Product not found');
          navigate('/manage-products');
        }
      } else {
        alert('Error loading product');
        navigate('/manage-products');
      }
    } catch (error) {
      console.error('Error loading product:', error);
      alert('Error loading product');
      navigate('/manage-products');
    } finally {
      setLoading(false);
    }
  }, [productId, navigate]);

  // Check if admin is logged in and load product
  useEffect(() => {
    const adminLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!adminLoggedIn) {
      navigate('/secret-admin-panel');
    } else {
      loadProduct();
    }
  }, [navigate, productId, loadProduct]);

  // Prevent navigation if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  // Check for changes
  useEffect(() => {
    if (originalProduct) {
      const hasFormChanges = 
        formData.name !== originalProduct.name ||
        formData.price !== originalProduct.price ||
        formData.category !== originalProduct.category ||
        formData.description !== originalProduct.description ||
        formData.stock !== originalProduct.stock ||
        JSON.stringify(formData.colors) !== JSON.stringify(originalProduct.colors || []) ||
        JSON.stringify(formData.sizes) !== JSON.stringify(originalProduct.sizes || []) ||
        formData.image !== null; // New image uploaded
      
      setHasChanges(hasFormChanges);
    }
  }, [formData, originalProduct]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) || 0 : value
    }));

    // Reset colors and sizes when category changes
    if (name === 'category') {
      setFormData(prev => ({
        ...prev,
        colors: [],
        sizes: []
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addColor = () => {
    if (selectedColor && !formData.colors.includes(selectedColor)) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, selectedColor]
      }));
      setSelectedColor('');
    }
  };

  const removeColor = (colorToRemove) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter(color => color !== colorToRemove)
    }));
  };

  const addSize = () => {
    if (selectedSize && !formData.sizes.includes(selectedSize)) {
      setFormData(prev => ({
        ...prev,
        sizes: [...prev.sizes, selectedSize]
      }));
      setSelectedSize('');
    }
  };

  const removeSize = (sizeToRemove) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter(size => size !== sizeToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!hasChanges) {
      alert('No changes detected');
      return;
    }

    // Validation
    if (!formData.name.trim()) {
      alert('Please enter product name');
      return;
    }
    
    if (!formData.price || formData.price <= 0) {
      alert('Please enter a valid price');
      return;
    }
    
    if (!formData.category) {
      alert('Please select a category');
      return;
    }
    
    if (!formData.description.trim()) {
      alert('Please enter product description');
      return;
    }

    setSaving(true);

    try {
      let updatedData = {
        name: formData.name.trim(),
        price: formData.price,
        category: formData.category,
        description: formData.description.trim(),
        colors: formData.colors,
        sizes: formData.sizes,
        stock: formData.stock
      };

      // Upload new image if provided
      if (formData.image) {
        const imageResult = await uploadImageAsBase64(formData.image);
        if (imageResult.success) {
          updatedData.image = imageResult.base64;
          updatedData.imageId = imageResult.imageId;
        } else {
          alert('Failed to upload image: ' + imageResult.error);
          return;
        }
      }

      const result = await updateProduct(productId, updatedData);

      if (result.success) {
        alert('Product updated successfully!');
        navigate('/manage-products');
      } else {
        alert('Failed to update product: ' + result.error);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('An error occurred while updating the product');
    } finally {
      setSaving(false);
    }
  };

  const selectedCategoryData = categoryOptions[formData.category];

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{width: '3rem', height: '3rem'}}></div>
          <h4>Loading Product...</h4>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-lg border-0 product-form-card">
            <div className="card-header bg-warning text-dark text-center py-4">
              <h2 className="mb-0 fw-bold">
                <i className="fas fa-edit me-2"></i>
                Edit Product
              </h2>
              <p className="mb-0 mt-2">Update product information</p>
            </div>
            
            <div className="card-body p-5">
              <form onSubmit={handleSubmit}>
                {/* Product Name */}
                <div className="mb-4">
                  <label htmlFor="name" className="form-label fw-bold">
                    <i className="fas fa-tag me-2 text-primary"></i>
                    Product Name *
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                    required
                  />
                </div>

                {/* Price */}
                <div className="mb-4">
                  <label htmlFor="price" className="form-label fw-bold">
                    <i className="fas fa-dollar-sign me-2 text-primary"></i>
                    Price (LE) *
                  </label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Enter price in Egyptian Pounds"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                {/* Stock */}
                <div className="mb-4">
                  <label htmlFor="stock" className="form-label fw-bold">
                    <i className="fas fa-boxes me-2 text-primary"></i>
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    placeholder="Enter stock quantity"
                    min="0"
                    required
                  />
                </div>

                {/* Category */}
                <div className="mb-4">
                  <label htmlFor="category" className="form-label fw-bold">
                    <i className="fas fa-list me-2 text-primary"></i>
                    Category *
                  </label>
                  <select
                    className="form-select form-select-lg"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {Object.entries(categoryOptions).map(([key, option]) => (
                      <option key={key} value={key}>{option.label}</option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label htmlFor="description" className="form-label fw-bold">
                    <i className="fas fa-align-left me-2 text-primary"></i>
                    Description *
                  </label>
                  <textarea
                    className="form-control form-control-lg"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter product description"
                    rows="4"
                    required
                  />
                </div>

                {/* Colors Section */}
                {selectedCategoryData && (
                  <div className="mb-4">
                    <label className="form-label fw-bold">
                      <i className="fas fa-palette me-2 text-primary"></i>
                      Available Colors
                    </label>
                    <div className="row">
                      <div className="col-md-8">
                        <select
                          className="form-select"
                          value={selectedColor}
                          onChange={(e) => setSelectedColor(e.target.value)}
                        >
                          <option value="">Select a color to add</option>
                          {selectedCategoryData.colors.map(color => (
                            <option key={color} value={color}>{color}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-4">
                        <button
                          type="button"
                          className="btn btn-outline-primary w-100"
                          onClick={addColor}
                          disabled={!selectedColor}
                        >
                          <i className="fas fa-plus me-1"></i>
                          Add Color
                        </button>
                      </div>
                    </div>
                    <div className="mt-3">
                      {formData.colors.map(color => (
                        <span key={color} className="badge bg-primary me-2 mb-2 fs-6">
                          {color}
                          <button
                            type="button"
                            className="btn-close btn-close-white ms-2"
                            onClick={() => removeColor(color)}
                            style={{fontSize: '0.7em'}}
                          ></button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sizes Section */}
                {selectedCategoryData && (
                  <div className="mb-4">
                    <label className="form-label fw-bold">
                      <i className="fas fa-ruler me-2 text-primary"></i>
                      Available Sizes
                    </label>
                    <div className="row">
                      <div className="col-md-8">
                        <select
                          className="form-select"
                          value={selectedSize}
                          onChange={(e) => setSelectedSize(e.target.value)}
                        >
                          <option value="">Select a size to add</option>
                          {selectedCategoryData.sizes.map(size => (
                            <option key={size} value={size}>{size}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-4">
                        <button
                          type="button"
                          className="btn btn-outline-primary w-100"
                          onClick={addSize}
                          disabled={!selectedSize}
                        >
                          <i className="fas fa-plus me-1"></i>
                          Add Size
                        </button>
                      </div>
                    </div>
                    <div className="mt-3">
                      {formData.sizes.map(size => (
                        <span key={size} className="badge bg-success me-2 mb-2 fs-6">
                          {size}
                          <button
                            type="button"
                            className="btn-close btn-close-white ms-2"
                            onClick={() => removeSize(size)}
                            style={{fontSize: '0.7em'}}
                          ></button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Image Upload */}
                <div className="mb-4">
                  <label htmlFor="image" className="form-label fw-bold">
                    <i className="fas fa-image me-2 text-primary"></i>
                    Product Image
                  </label>
                  <input
                    type="file"
                    className="form-control form-control-lg"
                    id="image"
                    name="image"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                  <div className="form-text">
                    Leave empty to keep current image. Upload a new image to replace it.
                  </div>
                  {imagePreview && (
                    <div className="mt-3">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="img-thumbnail"
                        style={{maxWidth: '200px', maxHeight: '200px'}}
                      />
                    </div>
                  )}
                </div>

                {/* Changes Status */}
                {hasChanges && (
                  <div className="alert alert-info mb-4">
                    <i className="fas fa-info-circle me-2"></i>
                    You have unsaved changes. Click "Commit Changes" to save them.
                  </div>
                )}

                {/* Action Buttons */}
                <div className="d-flex gap-3 justify-content-center">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-lg px-4"
                    onClick={() => navigate('/manage-products')}
                    disabled={saving}
                  >
                    <i className="fas fa-arrow-left me-2"></i>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-warning btn-lg px-4"
                    disabled={saving || !hasChanges}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-2"></i>
                        Commit Changes
                      </>
                    )}
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

export default EditProduct; 