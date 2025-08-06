import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const res = await axios.get(`http://localhost:5000/orders/client/${user._id}`);
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#FF9800';
      case 'confirmed': return '#2196F3';
      case 'preparing': return '#FF5722';
      case 'ready': return '#9C27B0';
      case 'delivered': return '#4CAF50';
      case 'cancelled': return '#f44336';
      default: return '#666';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <i className="bi bi-clock"></i>;
      case 'confirmed': return <i className="bi bi-check-circle"></i>;
      case 'preparing': return <i className="bi bi-fire"></i>;
      case 'ready': return <i className="bi bi-check2-circle"></i>;
      case 'delivered': return <i className="bi bi-truck"></i>;
      case 'cancelled': return <i className="bi bi-x-circle"></i>;
      default: return <i className="bi bi-list-ul"></i>;
    }
  };

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-warning" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3" style={{ color: '#FF5722' }}>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold" style={{ color: '#FF5722' }}>
          <i className="bi bi-list-ul"></i> Customer Orders
        </h1>
        <p className="lead" style={{ color: '#666' }}>Manage incoming orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-5">
          <h3 style={{ color: '#FF9800' }}><i className="bi bi-box"></i> No orders found</h3>
          <p className="text-muted">No customer orders yet!</p>
        </div>
      ) : (
        <div className="row g-4">
          {orders.map((order) => (
            <div key={order._id} className="col-lg-6">
              <div className="card h-100 shadow-lg border-0" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                <div className="card-header d-flex justify-content-between align-items-center py-3" style={{ background: 'linear-gradient(135deg, #FF5722 0%, #FF9800 100%)', color: 'white' }}>
                  <div>
                    <h6 className="mb-0">Order #{order._id.slice(-6)}</h6>
                    <small>{new Date(order.orderDate).toLocaleDateString()}</small>
                  </div>
                  <span 
                    className="badge px-3 py-2" 
                    style={{ 
                      backgroundColor: getStatusColor(order.status), 
                      fontSize: '14px',
                      borderRadius: '20px'
                    }}
                  >
                    {getStatusIcon(order.status)} {order.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="card-body p-4" style={{ background: 'linear-gradient(145deg, #ffffff, #f8f9fa)' }}>
                  <div className="mb-3">
                    <h6 style={{ color: '#FF5722' }}><i className="bi bi-person"></i> Customer: {order.customerName || 'N/A'}</h6>
                    <p className="text-muted small"><i className="bi bi-geo-alt"></i> {order.deliveryAddress}</p>
                    <p className="text-muted small"><i className="bi bi-telephone"></i> {order.phone}</p>
                  </div>
                  
                  <div className="mb-3">
                    <h6 style={{ color: '#FF5722' }}><i className="bi bi-list-ul"></i> Items: {order.items.length}</h6>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                    <h6 className="mb-0">Total:</h6>
                    <h5 className="mb-0 text-success">PKR {order.totalAmount}</h5>
                  </div>
                  
                  <button
                    onClick={() => navigate(`/order-details/${order._id}`)}
                    className="btn w-100 mt-3"
                    style={{
                      background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '15px',
                      fontWeight: 'bold'
                    }}
                  >
                    <i className="bi bi-eye"></i> View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;