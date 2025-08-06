import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  useEffect(() => {
    const handlePopState = () => {
      navigate('/restaurants', { replace: true });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigate]);

  if (!order) {
    return (
      <div className="container my-5 text-center">
        <h3 className="text-muted">No order information found</h3>
        <button onClick={() => navigate('/products')} className="btn btn-primary mt-3">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-lg border-0" style={{ borderRadius: '20px' }}>
            <div className="card-header text-white text-center py-4" style={{ background: 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)' }}>
              <h2 className="mb-0"><i className="bi bi-check-circle"></i> Order Confirmed!</h2>
              <p className="mb-0 mt-2" style={{ opacity: '0.9' }}>Thank you for your order</p>
            </div>
            
            <div className="card-body p-4" style={{ background: 'linear-gradient(145deg, #ffffff, #f8f9fa)' }}>
              <div className="text-center mb-4">
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}><i className="bi bi-check-circle-fill" style={{color: '#4CAF50'}}></i></div>
                <h4 style={{ color: '#4CAF50' }}>Your order has been placed successfully!</h4>
                <p className="text-muted">Order ID: <strong>{order._id}</strong></p>
              </div>
              
              <div className="row mb-4">
                <div className="col-md-6">
                  <h6 style={{ color: '#FF5722' }}><i className="bi bi-geo-alt"></i> Delivery Address:</h6>
                  <p className="text-muted">{order.deliveryAddress}</p>
                  <h6 style={{ color: '#FF5722' }}><i className="bi bi-building"></i> City:</h6>
                  <p className="text-muted">{order.city}</p>
                </div>
                <div className="col-md-6">
                  <h6 style={{ color: '#FF5722' }}><i className="bi bi-telephone"></i> Phone:</h6>
                  <p className="text-muted">{order.phone}</p>
                  <h6 style={{ color: '#FF5722' }}><i className="bi bi-credit-card"></i> Payment:</h6>
                  <p className="text-muted">{order.paymentMethod === 'cash' ? <><i className="bi bi-cash"></i> Cash on Delivery</> : order.paymentMethod || 'Cash on Delivery'}</p>
                  {order.allergies && (
                    <>
                      <h6 style={{ color: '#FF5722' }}><i className="bi bi-exclamation-triangle"></i> Special Instructions:</h6>
                      <p className="text-muted">{order.allergies}</p>
                    </>
                  )}
                </div>
              </div>
              
              <h6 style={{ color: '#FF5722' }}><i className="bi bi-list-ul"></i> Order Items:</h6>
              <div className="mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                    <div>
                      <h6 className="mb-0">{item.name}</h6>
                      {item.restaurantName && (
                        <small className="text-muted d-block">{item.restaurantName}</small>
                      )}
                      <small className="text-muted">Qty: {item.quantity}</small>
                    </div>
                    <div className="text-end">
                      {item.discount > 0 ? (
                        <>
                          <div><small className="text-decoration-line-through text-muted">PKR {item.price}</small></div>
                          <div className="text-success fw-bold">PKR {item.finalPrice.toFixed(2)}</div>
                        </>
                      ) : (
                        <div className="text-success fw-bold">PKR {item.price}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="d-flex justify-content-between align-items-center mb-4 p-3" style={{ background: '#f8f9fa', borderRadius: '15px' }}>
                <h5 className="mb-0">Total Amount:</h5>
                <h4 className="mb-0 text-success">PKR {order.totalAmount}</h4>
              </div>
              
              <div className="text-center">
                <button 
                  onClick={() => navigate('/recent-orders')}
                  className="btn btn-lg me-3"
                  style={{
                    background: 'linear-gradient(45deg, #FF5722, #FF9800)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '25px',
                    fontWeight: 'bold',
                    padding: '12px 30px'
                  }}
                >
                  <i className="bi bi-list-ul"></i> View Orders
                </button>
                <button 
                  onClick={() => navigate('/products')}
                  className="btn btn-lg"
                  style={{
                    background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '25px',
                    fontWeight: 'bold',
                    padding: '12px 30px'
                  }}
                >
                  <i className="bi bi-cart"></i> Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;