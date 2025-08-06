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
              <span style={{ background: 'linear-gradient(45deg, #FF5722, #FF9800)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>FoodExpress</span>
            </h5>
            <p className="small" style={{ color: '#CCCCCC' }}>
              Fresh meals delivered to your door in minutes. Your hunger, our mission.
            </p>
         </div>

          <div className="col-md-2 mb-4">
            <h6 className="fw-semibold" style={{ color: '#FF9800' }}><i className="bi bi-utensils"></i> Explore</h6>
            <ul className="list-unstyled">
              <li><a href="/restaurants" className="footer-link" style={{ color: '#CCCCCC', textDecoration: 'none' }}>Restaurants</a></li>

              <li><a href="/cart" className="footer-link" style={{ color: '#CCCCCC', textDecoration: 'none' }}>Cart</a></li>
            </ul>
          </div>

          <div className="col-md-2 mb-4">
            <h6 className="fw-semibold" style={{ color: '#FF9800' }}><i className="bi bi-building"></i> Company</h6>
            <ul className="list-unstyled">
              <li><a href="/recent-orders" className="footer-link" style={{ color: '#CCCCCC', textDecoration: 'none' }}>My Orders</a></li>
              <li><a href="/profile" className="footer-link" style={{ color: '#CCCCCC', textDecoration: 'none' }}>Profile</a></li>

            </ul>
          </div>

          <div className="col-md-4 mb-4">
            <h6 className="fw-semibold" style={{ color: '#FF9800' }}><i className="bi bi-percent"></i> Special Offers</h6>
            <div className="mt-3">
              <span className="badge rounded-pill px-3 py-2" style={{ background: 'linear-gradient(45deg, #FF5722, #FF9800)', color: 'white' }}>
                <i className="bi bi-truck"></i> Fastest Delivery
              </span>
            </div>
            <p className="small mt-2" style={{ color: '#CCCCCC' }}>Order anytime, anywhere.</p>
          </div>


        </div>
        <hr style={{ borderColor: '#444' }} />
        <div className="text-center small" style={{ color: '#CCCCCC' }}>
          <p className="mb-2">
            &copy; {new Date().getFullYear()} FoodExpress. All rights reserved.
          </p>
          <p className="mb-0" style={{ color: '#FF9800' }}>
            Made with <i className="bi bi-heart-fill" style={{ color: '#FF5722' }}></i> for food lovers everywhere
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
