import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simple admin credentials check
    if (email === 'admin@nasrstore.com' && password === 'admin123') {
      localStorage.setItem('adminLoggedIn', 'true');
      navigate('/admin-dashboard');
    } else {
      setError('Invalid email or password');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-lg border-0">
              <div className="card-header bg-primary text-white text-center py-4">
                <h2 className="mb-0 fw-bold">
                  <i className="fas fa-shield-alt me-2"></i>
                  Admin Login
                </h2>
              </div>
              
              <div className="card-body p-5">
                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      {error}
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <label htmlFor="email" className="form-label fw-bold">
                      <i className="fas fa-envelope me-2 text-primary"></i>
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter admin email"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="password" className="form-label fw-bold">
                      <i className="fas fa-lock me-2 text-primary"></i>
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter admin password"
                      required
                    />
                  </div>
                  
                  <div className="d-grid mb-4">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Logging in...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-sign-in-alt me-2"></i>
                          Login
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => navigate('/')}
                      className="btn btn-link text-muted"
                    >
                      <i className="fas fa-arrow-left me-1"></i>
                      Back to Store
                    </button>
                  </div>
                </form>
              </div>
              
              <div className="card-footer bg-light text-center py-3">
                <small className="text-muted">
                  <i className="fas fa-info-circle me-1"></i>
                  Demo Credentials: admin@nasrstore.com / admin123
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin; 