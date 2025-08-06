import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState('');
  const [productsMap, setProductsMap] = useState({});
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/products/cart', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.message || 'Failed to fetch cart');
        setCartItems([]);
        return;
      }
      const data = await res.json();
      setCartItems(data);

      // Fetch product details for each productId in cart
      const productIds = data.map(item => item.productId);
      if (productIds.length > 0) {
        const [productsRes, restaurantsRes] = await Promise.all([
          fetch('http://localhost:5000/products', {
            headers: { 'Authorization': token ? `Bearer ${token}` : '' }
          }),
          fetch('http://localhost:5000/Clientauth/restaurants')
        ]);
        
        if (productsRes.ok && restaurantsRes.ok) {
          const productsData = await productsRes.json();
          const restaurantsData = await restaurantsRes.json();
          const restaurants = restaurantsData.restaurants || [];
          
          const map = {};
          productsData.forEach(p => {
            const restaurant = restaurants.find(r => r._id === p.clientId);
            map[p._id] = {
              ...p,
              restaurantName: restaurant?.restaurantName || 'Unknown Restaurant'
            };
          });
          setProductsMap(map);
        }
      }
    } catch (err) {
      setError('Failed to fetch cart');
      setCartItems([]);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/products/cart/remove', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ productId }),
      });
      if (res.ok) {
        fetchCart(); // Refresh cart
        window.dispatchEvent(new Event('cartUpdated'));
      }
    } catch (err) {
      console.error('Error removing item from cart');
    }
  };

  const updateQuantity = async (productId, action) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/products/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ productId, action }),
      });
      if (res.ok) {
        fetchCart();
        window.dispatchEvent(new Event('cartUpdated'));
      }
    } catch (err) {
      console.error('Error updating quantity');
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (error) {
    return <div className="container my-5"><div className="alert alert-danger text-center">{error}</div></div>;
  }

  if (cartItems.length === 0) {
    return <div className="container my-5 text-center"><h3 className="text-muted"><i className="bi bi-cart"></i> Your cart is empty.</h3></div>;
  }

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-header text-white text-center py-3" style={{ background: 'linear-gradient(135deg, #FF5722 0%, #FF9800 100%)' }}>
              <h2 className="mb-0">
                <i className="bi bi-cart" style={{ fontSize: '1.2em', marginRight: '10px' }}></i>
                Your Cart
              </h2>
            </div>
            <div className="card-body p-0">
              {cartItems.map((item, index) => {
                const product = productsMap[item.productId];
                return (
                  <div key={index} className="border-bottom p-4 hover-bg">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        {product ? (
                          <>
                            <img
                              src={product.image ? `http://localhost:5000${product.image}` : ''}
                              alt={product.name}
                              className="rounded shadow-sm"
                              style={{ width: '80px', height: '80px', objectFit: 'cover', marginRight: '20px' }}
                            />
                            <div>
                              <h5 className="mb-1 text-dark">{product.name}</h5>
                              <small className="text-muted d-block mb-1">{product.restaurantName}</small>
                              <div className="d-flex align-items-center gap-3 mb-1">
                                <span className="text-muted">Quantity:</span>
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '10px',
                                  background: '#f8f9fa',
                                  padding: '5px 10px',
                                  borderRadius: '20px',
                                  width: 'fit-content'
                                }}>
                                  <button 
                                    onClick={() => updateQuantity(item.productId, 'decrement')}
                                    style={{
                                      width: '28px',
                                      height: '28px',
                                      border: '2px solid #FF5722',
                                      background: 'white',
                                      borderRadius: '50%',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: '16px',
                                      fontWeight: 'bold',
                                      color: '#FF5722',
                                      transition: 'all 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                      e.target.style.background = '#FF5722';
                                      e.target.style.color = 'white';
                                      e.target.style.transform = 'scale(1.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.target.style.background = 'white';
                                      e.target.style.color = '#FF5722';
                                      e.target.style.transform = 'scale(1)';
                                    }}
                                  >
                                    -
                                  </button>
                                  <span style={{
                                    minWidth: '30px',
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    fontSize: '16px',
                                    color: '#333'
                                  }}>{item.quantity}</span>
                                  <button 
                                    onClick={() => updateQuantity(item.productId, 'increment')}
                                    style={{
                                      width: '28px',
                                      height: '28px',
                                      border: '2px solid #FF5722',
                                      background: 'white',
                                      borderRadius: '50%',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: '16px',
                                      fontWeight: 'bold',
                                      color: '#FF5722',
                                      transition: 'all 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                      e.target.style.background = '#FF5722';
                                      e.target.style.color = 'white';
                                      e.target.style.transform = 'scale(1.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.target.style.background = 'white';
                                      e.target.style.color = '#FF5722';
                                      e.target.style.transform = 'scale(1)';
                                    }}
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                              {product.discount > 0 ? (
                                <div>
                                  <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '14px' }}>PKR {product.price}</span>
                                  <span className="text-success fw-bold ms-2">PKR {(product.price * (1 - product.discount / 100)).toFixed(2)}</span>
                                  <span className="badge bg-danger ms-2">{product.discount}% OFF</span>
                                </div>
                              ) : (
                                <p className="mb-0 text-success fw-bold">PKR {product.price}</p>
                              )}
                            </div>
                          </>
                        ) : (
                          <div className="text-muted">
                            Product ID: {item.productId} - Quantity: {item.quantity}
                          </div>
                        )}
                      </div>
                      <button 
                        className="btn btn-sm"
                        onClick={() => removeFromCart(item.productId)}
                        style={{ 
                          background: 'transparent', 
                          color: '#f44336', 
                          border: 'none',
                          borderRadius: '50%',
                          width: '35px',
                          height: '35px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '16px',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#e0e0e0';
                          e.target.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'transparent';
                          e.target.style.transform = 'scale(1)';
                        }}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="card-footer text-center py-4" style={{ background: 'linear-gradient(145deg, #ffffff, #f8f9fa)' }}>
              <div className="row">
                <div className="col-md-6">
                  <h5 className="text-muted mb-0">Total Items: <span className="text-dark">{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span></h5>
                </div>
                <div className="col-md-6">
                  <h4 className="mb-0" style={{ color: '#4CAF50' }}>
                    Total: PKR {cartItems.reduce((sum, item) => {
                      const product = productsMap[item.productId];
                      if (product) {
                        const discountedPrice = product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price;
                        return sum + (discountedPrice * item.quantity);
                      }
                      return sum;
                    }, 0).toFixed(2)}
                  </h4>
                </div>
              </div>
              <button 
                onClick={() => navigate('/checkout')}
                className="btn btn-lg w-100 mt-3"
                style={{
                  background: 'linear-gradient(45deg, #FF5722, #FF9800)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '25px',
                  fontWeight: 'bold',
                  fontSize: '18px',
                  padding: '12px'
                }}
              >
                <i className="bi bi-credit-card"></i> Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
