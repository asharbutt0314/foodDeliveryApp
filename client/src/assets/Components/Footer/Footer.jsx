import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="pt-5 pb-3" style={{ background: 'linear-gradient(135deg, #2E2E2E 0%, #1A1A1A 100%)', color: 'white' }}>
      <div className="container">
        <div className="row">

          <div className="col-md-4 mb-4">
            <h5 className="fw-bold" style={{ fontSize: '1.5rem' }}>
              <i className="bi bi-shop" style={{ fontSize: '1.3em', marginRight: '10px' }}></i>
              <span style={{ background: 'linear-gradient(45deg, #FF5722, #FF9800)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>FoodExpress Admin</span>
            </h5>
            <p className="small" style={{ color: '#CCCCCC' }}>
              Restaurant management made easy. Manage your menu, orders, and customers.
            </p>
          </div>

          <div className="col-md-2 mb-4">
            <h6 className="fw-semibold" style={{ color: '#FF9800' }}><i className="bi bi-list-ul"></i> Management</h6>
            <ul className="list-unstyled">
              <li><a href="/products" className="footer-link" style={{ color: '#CCCCCC', textDecoration: 'none' }}>Products</a></li>
              <li><a href="/orders" className="footer-link" style={{ color: '#CCCCCC', textDecoration: 'none' }}>Orders</a></li>
            </ul>
          </div>

          <div className="col-md-2 mb-4">
            <h6 className="fw-semibold" style={{ color: '#FF9800' }}><i className="bi bi-building"></i> Support</h6>
            <ul className="list-unstyled">
              <li><a href="/profile" className="footer-link" style={{ color: '#CCCCCC', textDecoration: 'none' }}>Profile</a></li>

            </ul>
          </div>

          <div className="col-md-4 mb-4">
            <h6 className="fw-semibold" style={{ color: '#FF9800' }}><i className="bi bi-bar-chart"></i> Analytics</h6>
            <div className="mt-3">
              <span className="badge rounded-pill px-3 py-2" style={{ background: 'linear-gradient(45deg, #FF5722, #FF9800)', color: 'white' }}>
                <i className="bi bi-speedometer2"></i> Admin Dashboard
              </span>
            </div>
            <p className="small mt-2" style={{ color: '#CCCCCC' }}>Track your restaurant performance.</p>
          </div>


        </div>
        <hr style={{ borderColor: '#444' }} />
        <div className="text-center small" style={{ color: '#CCCCCC' }}>
          <p className="mb-2">
            &copy; {new Date().getFullYear()} FoodExpress Admin Panel. All rights reserved.
          </p>
          <p className="mb-0" style={{ color: '#FF9800' }}>
            Built with <i className="bi bi-heart-fill" style={{ color: '#FF5722' }}></i> for restaurant owners
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
