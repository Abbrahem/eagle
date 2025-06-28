import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [cartCount, setCartCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update cart count from localStorage
  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
        const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
        setCartCount(totalItems);
      } catch (error) {
        console.error('Error updating cart count:', error);
        setCartCount(0);
      }
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cartUpdated', updateCartCount);
    const interval = setInterval(updateCartCount, 5000);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
      clearInterval(interval);
    };
  }, []);

  const scrollToSection = (sectionId) => {
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 200);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
    setCategoriesOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setCategoriesOpen(false); // Close categories when toggling main menu
  };

  const toggleCategories = (e) => {
    e.preventDefault();
    setCategoriesOpen(!categoriesOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setCategoriesOpen(false);
  };

  const handleCategoryClick = (category) => {
    navigate(`/category/${category}`);
    closeMenu();
  };

  return (
    <>
      <nav className={`navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="container">
          {/* Brand */}
          <Link className="navbar-brand fw-bold text-primary d-flex align-items-center" to="/" onClick={closeMenu}>
            <i className="fas fa-store me-2"></i>
            <span>store | نسر</span>
          </Link>
          
          {/* Mobile Menu Toggle */}
          <button
            className="navbar-toggler border-0 p-0"
            type="button"
            onClick={toggleMenu}
            aria-controls="navbarNav"
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation"
          >
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-primary`} style={{ fontSize: '1.5rem' }}></i>
          </button>

          {/* Navigation Menu */}
          <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {/* Home */}
              <li className="nav-item">
                <Link 
                  className="nav-link fw-semibold px-3 py-2" 
                  to="/" 
                  onClick={closeMenu}
                >
                  <i className="fas fa-home me-2"></i>
                  Home
                </Link>
              </li>
              
              {/* Products */}
              <li className="nav-item">
                <Link 
                  className="nav-link fw-semibold px-3 py-2" 
                  to="/products" 
                  onClick={closeMenu}
                >
                  <i className="fas fa-shopping-bag me-2"></i>
                  Products
                </Link>
              </li>
              
              {/* Categories Dropdown */}
              <li className="nav-item dropdown">
                                 {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                 <a 
                   className="nav-link dropdown-toggle fw-semibold px-3 py-2" 
                   href="#" 
                   role="button" 
                   onClick={toggleCategories}
                   aria-expanded={categoriesOpen}
                 >
                  <i className="fas fa-th-large me-2"></i>
                  Categories
                </a>
                                 <ul className={`dropdown-menu ${categoriesOpen ? 'show' : ''}`} style={{
                   position: 'absolute',
                   top: '100%',
                   left: '0',
                   right: 'auto',
                   minWidth: '200px',
                   maxWidth: '90vw',
                   backgroundColor: 'white',
                   border: '1px solid #dee2e6',
                   borderRadius: '0.375rem',
                   boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
                   zIndex: 1000,
                   transform: 'translateX(0)'
                 }}>
                  <li>
                    <button 
                      className="dropdown-item d-flex align-items-center py-2 px-3" 
                      onClick={() => handleCategoryClick('t-shirt')}
                    >
                      <i className="fas fa-tshirt me-2 text-primary"></i>
                      T-Shirts
                    </button>
                  </li>
                  <li>
                    <button 
                      className="dropdown-item d-flex align-items-center py-2 px-3" 
                      onClick={() => handleCategoryClick('pants')}
                    >
                      <i className="fas fa-user-tie me-2 text-primary"></i>
                      Pants
                    </button>
                  </li>
                  <li>
                    <button 
                      className="dropdown-item d-flex align-items-center py-2 px-3" 
                      onClick={() => handleCategoryClick('accessories')}
                    >
                      <i className="fas fa-gem me-2 text-primary"></i>
                      Accessories
                    </button>
                  </li>
                </ul>
              </li>
              
              {/* About */}
              <li className="nav-item">
                <button 
                  className="nav-link btn btn-link fw-semibold px-3 py-2 border-0" 
                  onClick={() => scrollToSection('info')}
                >
                  <i className="fas fa-info-circle me-2"></i>
                  About
                </button>
              </li>
              
              {/* Contact */}
              <li className="nav-item">
                <button 
                  className="nav-link btn btn-link fw-semibold px-3 py-2 border-0" 
                  onClick={() => scrollToSection('contact')}
                >
                  <i className="fas fa-envelope me-2"></i>
                  Contact
                </button>
              </li>
            </ul>
            
            {/* Cart Button - Desktop */}
            <div className="d-none d-lg-flex align-items-center">
              <Link 
                to="/cart" 
                className="btn btn-primary position-relative d-flex align-items-center" 
                onClick={closeMenu}
                style={{
                  borderRadius: '25px',
                  padding: '10px 20px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  minWidth: 'auto',
                  transition: 'all 0.3s ease'
                }}
              >
                <i className="fas fa-shopping-cart me-2"></i>
                <span>Cart</span>
                {cartCount > 0 && (
                  <span 
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      minWidth: '1.5rem',
                      height: '1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Cart Button - Mobile */}
            <div className="d-lg-none mt-3">
              <Link 
                to="/cart" 
                className="btn btn-primary position-relative d-flex align-items-center justify-content-center w-100" 
                onClick={closeMenu}
                style={{
                  borderRadius: '25px',
                  padding: '12px 20px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  fontSize: '1.1rem',
                  transition: 'all 0.3s ease'
                }}
              >
                <i className="fas fa-shopping-cart me-2"></i>
                <span>سلة التسوق</span>
                {cartCount > 0 && (
                  <span 
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      minWidth: '1.5rem',
                      height: '1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="d-lg-none position-fixed w-100 h-100 bg-dark bg-opacity-50" 
          style={{ top: 0, left: 0, zIndex: 1040 }}
          onClick={closeMenu}
        ></div>
      )}

      <style jsx>{`
        .navbar {
          transition: all 0.3s ease;
          z-index: 1050;
        }
        
        .navbar-scrolled {
          box-shadow: 0 2px 20px rgba(0,0,0,0.1) !important;
        }
        
        .nav-link {
          transition: all 0.3s ease;
          color: #374151 !important;
          border-radius: 0.375rem;
          margin: 0 0.25rem;
        }
        
        .nav-link:hover, .nav-link:focus {
          color: #2563eb !important;
          background-color: #f3f4f6;
          transform: translateY(-1px);
        }
        
        .dropdown-menu {
          border: none;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          border-radius: 0.75rem;
          padding: 0.5rem 0;
          margin-top: 0.5rem;
        }
        
        .dropdown-item {
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          transition: all 0.2s ease;
          border-radius: 0.5rem;
          margin: 0.125rem 0.5rem;
          color: #374151;
        }
        
        .dropdown-item:hover, .dropdown-item:focus {
          background-color: #f3f4f6;
          color: #2563eb;
          transform: translateX(5px);
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          border: none;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }
        
        .btn-primary:hover {
          background: linear-gradient(135deg, #1d4ed8, #2563eb);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
        }
        
        /* Mobile Responsive */
        @media (max-width: 991.98px) {
          .navbar-collapse {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border-radius: 0 0 1rem 1rem;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            padding: 1rem;
            z-index: 1050;
          }
          
          .dropdown-menu {
            position: static !important;
            transform: none !important;
            box-shadow: none !important;
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
            margin: 0.5rem 0;
            left: auto !important;
            right: auto !important;
            top: auto !important;
            width: 100% !important;
            max-width: 100% !important;
            min-width: auto !important;
          }
          
          .nav-item {
            margin: 0.25rem 0;
            width: 100%;
          }
          
          .nav-link {
            padding: 0.75rem 1rem !important;
            border-radius: 0.5rem;
          }
          
          .dropdown {
            width: 100%;
          }
        }
        
        /* Extra Mobile Dropdown Fix */
        @media (max-width: 576px) {
          .dropdown-menu {
            margin-left: 0 !important;
            margin-right: 0 !important;
            left: 0 !important;
            right: 0 !important;
            transform: translateX(0) !important;
            max-width: calc(100vw - 2rem) !important;
            overflow-x: hidden;
          }
          
          .dropdown-item {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 100%;
            padding: 0.75rem 1rem;
          }
        }
        
        /* Small mobile screens */
        @media (max-width: 576px) {
          .container {
            padding-left: 0.75rem;
            padding-right: 0.75rem;
          }
          
          .navbar-brand {
            font-size: 1rem;
          }
          
          .nav-link {
            font-size: 0.9rem;
          }
        }
        
        /* Extra small screens */
        @media (max-width: 480px) {
          .navbar-brand {
            font-size: 0.9rem;
          }
          
          .container {
            padding-left: 0.5rem;
            padding-right: 0.5rem;
          }
        }
        
        /* Very small screens */
        @media (max-width: 380px) {
          .navbar-brand {
            font-size: 0.85rem;
          }
          
          .navbar-brand i {
            font-size: 0.8rem;
            margin-right: 0.25rem !important;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;