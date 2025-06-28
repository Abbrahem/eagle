import React from 'react';

const Footer = () => {
  return (
    <footer className="footer py-5 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-md-6 mb-4">
            <h5 className="text-white mb-3">
              <i className="fas fa-store text-primary me-2"></i>
              store | نسر
            </h5>
            <p className="text-light">
              Premium quality clothing for everyone. We believe in providing 
              the best fashion at affordable prices with exceptional customer service.
            </p>
          </div>
          
          <div className="col-lg-2 col-md-6 mb-4">
            <h6 className="text-white mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li><a href="/" className="text-light text-decoration-none">Home</a></li>
              <li className="mt-2"><a href="/products" className="text-light text-decoration-none">Products</a></li>
              <li className="mt-2"><a href="#about" className="text-light text-decoration-none">About Us</a></li>
              <li className="mt-2"><a href="#contact" className="text-light text-decoration-none">Contact</a></li>
            </ul>
          </div>
          
          <div className="col-lg-3 col-md-6 mb-4">
            <h6 className="text-white mb-3">Categories</h6>
            <ul className="list-unstyled">
              <li><a href="/category/t-shirt" className="text-light text-decoration-none">T-Shirts</a></li>
              <li className="mt-2"><a href="/category/pants" className="text-light text-decoration-none">Pants</a></li>
              <li className="mt-2"><a href="/category/accessories" className="text-light text-decoration-none">Accessories</a></li>
            </ul>
          </div>
          
          <div className="col-lg-3 col-md-6 mb-4">
            <h6 className="text-white mb-3">Follow Us</h6>
            <div className="d-flex">
              <a href="https://facebook.com" className="social-icon me-3" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://instagram.com" className="social-icon me-3" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://twitter.com" className="social-icon me-3" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>
        </div>
        
        <hr className="my-4 bg-light" />
        
        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="text-light mb-0">© 2022 store | نسر. All rights reserved.</p>
          </div>
          <div className="col-md-6 text-md-end">
            <p className="text-light mb-0">
              Made with ❤️ for fashion lovers
              <span className="ms-3">
                <a href="/secret-admin-panel" className="text-light text-decoration-none small">
                  <i className="fas fa-shield-alt me-1"></i>
                  Admin
                </a>
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 