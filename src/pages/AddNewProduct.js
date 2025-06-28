import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProduct, uploadImageAsBase64 } from '../firebase';

const AddNewProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    colors: [],
    sizes: [],
    image: null
  });
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

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

  // Check if admin is logged in
  React.useEffect(() => {
    const adminLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!adminLoggedIn) {
      navigate('/secret-admin-panel');
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
    
    // Validation
    if (!formData.name || !formData.price || !formData.category || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    if (!formData.image) {
      alert('Please select an image');
      return;
    }

    if (formData.category !== 'accessories' && formData.colors.length === 0) {
      alert('Please add at least one color');
      return;
    }

    if (formData.category !== 'accessories' && formData.sizes.length === 0) {
      alert('Please add at least one size');
      return;
    }

    setLoading(true);

    try {
      // Upload image as Base64
      const imageResult = await uploadImageAsBase64(formData.image);
      
      if (!imageResult.success) {
        alert('Failed to upload image: ' + imageResult.error);
        setLoading(false);
        return;
      }

      // Prepare product data
      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        category: formData.category,
        description: formData.description,
        colors: formData.colors,
        sizes: formData.sizes,
        image: imageResult.base64, // استخدام Base64 بدلاً من URL
        imageId: imageResult.imageId, // حفظ معرف الصورة للاستخدام لاحقاً
        stock: 50, // Default stock
        createdAt: new Date().toISOString()
      };

      // Add product to Firebase
      const result = await addProduct(productData);

      if (result.success) {
        alert('Product added successfully!');
        
        // Reset form
        setFormData({
          name: '',
          price: '',
          category: '',
          description: '',
          colors: [],
          sizes: [],
          image: null
        });
        setImagePreview(null);
        setSelectedColor('');
        setSelectedSize('');
        
        // Navigate to manage products
        navigate('/manage-products');
      } else {
        alert('Failed to add product: ' + result.error);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('An error occurred while adding the product');
    } finally {
      setLoading(false);
    }
  };

  const selectedCategoryData = categoryOptions[formData.category];

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-lg border-0 product-form-card">
            <div className="card-header bg-primary text-white text-center py-4">
              <h2 className="mb-0 fw-bold">
                <i className="fas fa-plus-circle me-2"></i>
                Add New Product
              </h2>
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
                    className="form-control"
                    id="description"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter product description"
                    required
                  ></textarea>
                </div>

                {/* Colors Section */}
                {selectedCategoryData && selectedCategoryData.colors.length > 0 && (
                  <div className="mb-4">
                    <label className="form-label fw-bold">
                      <i className="fas fa-palette me-2 text-primary"></i>
                      Available Colors *
                    </label>
                    
                    <div className="row mb-3">
                      <div className="col-md-8">
                        <select
                          className="form-select"
                          value={selectedColor}
                          onChange={(e) => setSelectedColor(e.target.value)}
                        >
                          <option value="">Select Color</option>
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
                          Add
                        </button>
                      </div>
                    </div>

                    <div className="selected-items">
                      {formData.colors.map(color => (
                        <span key={color} className="badge bg-primary me-2 mb-2 p-2">
                          {color}
                          <button
                            type="button"
                            className="btn-close btn-close-white ms-2"
                            onClick={() => removeColor(color)}
                          ></button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sizes Section */}
                {selectedCategoryData && selectedCategoryData.sizes.length > 0 && (
                  <div className="mb-4">
                    <label className="form-label fw-bold">
                      <i className="fas fa-ruler me-2 text-primary"></i>
                      Available Sizes *
                    </label>
                    
                    <div className="row mb-3">
                      <div className="col-md-8">
                        <select
                          className="form-select"
                          value={selectedSize}
                          onChange={(e) => setSelectedSize(e.target.value)}
                        >
                          <option value="">Select Size</option>
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
                          Add
                        </button>
                      </div>
                    </div>

                    <div className="selected-items">
                      {formData.sizes.map(size => (
                        <span key={size} className="badge bg-success me-2 mb-2 p-2">
                          {size}
                          <button
                            type="button"
                            className="btn-close btn-close-white ms-2"
                            onClick={() => removeSize(size)}
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
                    Product Image *
                  </label>
                  <input
                    type="file"
                    className="form-control form-control-lg"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    required
                  />
                  
                  {imagePreview && (
                    <div className="mt-3 text-center">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="img-thumbnail"
                        style={{maxWidth: '200px', maxHeight: '200px'}}
                      />
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg px-5 py-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Adding Product...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-plus me-2"></i>
                        Add Product
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

export default AddNewProduct; 