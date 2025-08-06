import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../Toast/ToastProvider';

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/orders/details/${orderId}`);
      setOrder(res.data);
    } catch (err) {
      console.error('Error fetching order details:', err);
      toast.addToast('Failed to load order details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (status) => {
    try {
      await axios.put(`http://localhost:5000/orders/update/${orderId}`, { status });
      setOrder({ ...order, status });
      toast.addToast(`Order ${status} successfully!`, 'success');
    } catch (err) {
      console.error('Error updating order status:', err);
      toast.addToast('Failed to update order status', 'error');
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

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-warning" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3" style={{ color: '#FF5722' }}>Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container my-5 text-center">
        <h3 className="text-muted">Order not found</h3>
        <button onClick={() => navigate('/orders')} className="btn btn-primary mt-3">
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-lg border-0" style={{ borderRadius: '20px' }}>
            <div className="card-header text-white text-center py-4" style={{ background: 'linear-gradient(135deg, #FF5722 0%, #FF9800 100%)' }}>
              <h2 className="mb-0"><i className="bi bi-list-ul"></i> Order Details</h2>
              <p className="mb-0 mt-2">Order #{order._id.slice(-6)}</p>
            </div>
            
            <div className="card-body p-4" style={{ background: 'linear-gradient(145deg, #ffffff, #f8f9fa)' }}>
              <div className="row mb-4">
                <div className="col-md-6">
                  <h6 style={{ color: '#FF5722' }}><i className="bi bi-person"></i> Customer Information:</h6>
                  <p className="mb-1"><strong>Name:</strong> {order.customerName || 'N/A'}</p>
                  <p className="mb-1"><strong>Phone:</strong> {order.phone}</p>
                  <p className="mb-1"><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
                </div>
                <div className="col-md-6">
                  <h6 style={{ color: '#FF5722' }}><i className="bi bi-geo-alt"></i> Delivery Information:</h6>
                  <p className="text-muted mb-1"><strong>Address:</strong> {order.deliveryAddress}</p>
                  <p className="text-muted mb-1"><strong>City:</strong> {order.city || 'N/A'}</p>
                  <p className="text-muted mb-1"><strong>Payment:</strong> {order.paymentMethod === 'cash' ? <><i className="bi bi-cash"></i> Cash on Delivery</> : order.paymentMethod || 'Cash on Delivery'}</p>
                  {order.allergies && (
                    <p className="text-muted mb-1"><strong>Special Instructions:</strong> {order.allergies}</p>
                  )}
                  <div className="mt-3">
                    <span 
                      className="badge px-3 py-2" 
                      style={{ 
                        backgroundColor: getStatusColor(order.status), 
                        fontSize: '16px',
                        borderRadius: '20px',
                        color: 'white'
                      }}
                    >
                      Status: {order.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
              
              <h6 style={{ color: '#FF5722' }}><i className="bi bi-cart"></i> Order Items:</h6>
              <div className="mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                    <div>
                      <h6 className="mb-0">{item.name}</h6>
                      <small className="text-muted">Qty: {item.quantity}</small>
                    </div>
                    <div className="text-end">
                      {item.discount > 0 ? (
                        <>
                          <div><small className="text-decoration-line-through text-muted">PKR {item.price}</small></div>
                          <div className="text-success fw-bold">PKR {item.finalPrice.toFixed(2)} each</div>
                          <div><small className="text-danger">{item.discount}% OFF</small></div>
                        </>
                      ) : (
                        <div className="text-success fw-bold">PKR {item.price} each</div>
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
                {order.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => updateOrderStatus('confirmed')}
                      className="btn btn-lg me-3"
                      style={{
                        background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '25px',
                        fontWeight: 'bold',
                        padding: '12px 30px'
                      }}
                    >
                      <i className="bi bi-check-circle"></i> Accept Order
                    </button>
                    <button 
                      onClick={() => updateOrderStatus('cancelled')}
                      className="btn btn-lg me-3"
                      style={{
                        background: 'linear-gradient(45deg, #f44336, #e53935)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '25px',
                        fontWeight: 'bold',
                        padding: '12px 30px'
                      }}
                    >
                      <i className="bi bi-x-circle"></i> Decline Order
                    </button>
                  </>
                )}
                
                {order.status === 'confirmed' && (
                  <button 
                    onClick={() => updateOrderStatus('preparing')}
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
                    <i className="bi bi-fire"></i> Start Preparing
                  </button>
                )}
                
                {order.status === 'preparing' && (
                  <button 
                    onClick={() => updateOrderStatus('ready')}
                    className="btn btn-lg me-3"
                    style={{
                      background: 'linear-gradient(45deg, #9C27B0, #E91E63)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '25px',
                      fontWeight: 'bold',
                      padding: '12px 30px'
                    }}
                  >
                    <i className="bi bi-check2-circle"></i> Mark as Ready
                  </button>
                )}
                
                {order.status === 'ready' && (
                  <button 
                    onClick={() => updateOrderStatus('delivered')}
                    className="btn btn-lg me-3"
                    style={{
                      background: 'linear-gradient(45deg, #2196F3, #03A9F4)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '25px',
                      fontWeight: 'bold',
                      padding: '12px 30px'
                    }}
                  >
                    <i className="bi bi-truck"></i> Mark as Delivered
                  </button>
                )}
                
                <button 
                  onClick={() => navigate('/orders')}
                  className="btn btn-lg"
                  style={{
                    background: 'linear-gradient(45deg, #666, #999)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '25px',
                    fontWeight: 'bold',
                    padding: '12px 30px'
                  }}
                >
                  <i className="bi bi-arrow-left"></i> Back to Orders
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;