import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CartSidebar = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [productsMap, setProductsMap] = useState({});
  const [restaurantName, setRestaurantName] = useState('');
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/products/cart', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
      if (res.ok) {
        const data = await res.json();
        setCartItems(data);

        const productIds = data.map(item => item.productId);
        if (productIds.length > 0) {
          const productsRes = await fetch('http://localhost:5000/products', {
            headers: {
              'Authorization': token ? `Bearer ${token}` : '',
            },
          });
          if (productsRes.ok) {
            const productsData = await productsRes.json();
            const map = {};
            productsData.forEach(p => {
              map[p._id] = p;
            });
            setProductsMap(map);
          }
          
          // Get restaurant info
          const restaurantRes = await fetch('http://localhost:5000/products/cart/restaurant', {
            headers: {
              'Authorization': token ? `Bearer ${token}` : '',
            },
          });
          if (restaurantRes.ok) {
            const restaurantData = await restaurantRes.json();
            setRestaurantName(restaurantData.restaurantName || '');
          }
        } else {
          setRestaurantName('');
        }
      }
    } catch (err) {
      console.error('Failed to fetch cart');
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
        fetchCart();
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
    if (isOpen) {
      fetchCart();
    }
  }, [isOpen]);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const calculateDiscountedPrice = (price, discount) => {
    return discount > 0 ? price * (1 - discount / 100) : price;
  };

  const totalPrice = cartItems.reduce((sum, item) => {
    const product = productsMap[item.productId];
    if (product) {
      const discountedPrice = calculateDiscountedPrice(product.price, product.discount || 0);
      return sum + (discountedPrice * item.quantity);
    }
    return sum;
  }, 0);

  return (
    <>
      {isOpen && <div className="cart-overlay" onClick={onClose}></div>}
      <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="cart-header" style={{ background: 'linear-gradient(135deg, #FF5722 0%, #FF9800 100%)', color: 'white' }}>
          <h4><i className="bi bi-cart"></i> Cart ({totalItems})</h4>
          <button className="btn-close" onClick={onClose} style={{ color: 'white' }}>×</button>
        </div>
        {restaurantName && (
          <div style={{ padding: '10px 20px', background: '#fff3cd', color: '#856404', fontSize: '14px', borderBottom: '1px solid #ffeaa7' }}>
            <i className="bi bi-geo-alt"></i> Items from: <strong>{restaurantName}</strong><br/>
            <small>You can add products from 1 restaurant at a time.</small>
          </div>
        )}
        <div className="cart-content">
          {cartItems.length === 0 ? (
           
            <div className="empty-cart-message">
              <div className="empty-cart-icon"><i className="bi bi-cart" style={{fontSize: '48px'}}></i></div>
              <h5 className="text-muted mb-2">Your cart is empty</h5>
              <p className="text-muted small">Add some delicious items to get started!</p>
            </div>
          ) : (
            cartItems.map((item, index) => {
              const product = productsMap[item.productId];
              return (
                <div key={index} className="cart-item">
                  {product && (
                    <>
                      <img
                        src={product.image ? `http://localhost:5000${product.image}` : ''}
                        alt={product.name}
                        className="cart-item-image"
                      />
                      <div className="cart-item-details">
                        <h6>{product.name}</h6>
                        <div className="quantity-controls">
                          <button 
                            className="qty-btn" 
                            onClick={() => updateQuantity(item.productId, 'decrement')}
                          >
                            -
                          </button>
                          <span className="qty-display">{item.quantity}</span>
                          <button 
                            className="qty-btn" 
                            onClick={() => updateQuantity(item.productId, 'increment')}
                          >
                            +
                          </button>
                        </div>
                        {product.discount > 0 ? (
                          <div>
                            <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '12px' }}>PKR {product.price}</span>
                            <span style={{ color: '#4CAF50', fontWeight: 'bold', marginLeft: '5px' }}>PKR {calculateDiscountedPrice(product.price, product.discount).toFixed(2)} each</span>
                          </div>
                        ) : (
                          <p>PKR {product.price} each</p>
                        )}
                      </div>
                      <button 
                        className="remove-btn"
                        onClick={() => removeFromCart(item.productId)}
                      >
                        ×
                      </button>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="total">Total: PKR {totalPrice.toFixed(2)}</div>
            <button 
              className="btn w-100 mt-2 mb-2"
              onClick={() => {
                navigate('/cart');
                onClose();
              }}
              style={{ background: 'linear-gradient(45deg, #4CAF50, #8BC34A)', color: 'white', border: 'none', borderRadius: '25px', fontWeight: 'bold' }}
            >
              View Full Cart
            </button>
            <button 
              className="btn w-100"
              onClick={() => {
                navigate('/checkout');
                onClose();
              }}
              style={{ background: 'linear-gradient(45deg, #FF5722, #FF9800)', color: 'white', border: 'none', borderRadius: '25px', fontWeight: 'bold' }}
            >
              <i className="bi bi-credit-card"></i> Checkout
            </button>
          </div>
        )}
      </div>
      <style>{`
        .cart-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.5);
          z-index: 999;
        }
        .cart-sidebar {
          position: fixed;
          top: 0;
          right: -400px;
          width: 400px;
          height: 100%;
          background: white;
          box-shadow: -2px 0 10px rgba(0,0,0,0.1);
          transition: right 0.3s ease;
          z-index: 1000;
          display: flex;
          flex-direction: column;
        }
        .cart-sidebar.open {
          right: 0;
        }
        .cart-header {
          padding: 20px;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .btn-close {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
        }
        .cart-content {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
        }
        .cart-item {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
          padding-bottom: 15px;
          border-bottom: 1px solid #f0f0f0;
          position: relative;
        }
        .cart-item-image {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 5px;
          margin-right: 15px;
        }
        .cart-item-details h6 {
          margin: 0;
          font-size: 14px;
        }
        .cart-item-details p {
          margin: 0;
          font-size: 12px;
          color: #666;
        }
        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 8px 0;
          background: #f8f9fa;
          padding: 5px 10px;
          border-radius: 20px;
          width: fit-content;
        }
        .qty-btn {
          width: 28px;
          height: 28px;
          border: 2px solid #FF5722;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: bold;
          color: #FF5722;
          transition: all 0.2s ease;
        }
        .qty-btn:hover {
          background: #FF5722;
          color: white;
          transform: scale(1.1);
        }
        .qty-display {
          min-width: 30px;
          text-align: center;
          font-weight: bold;
          font-size: 16px;
          color: #333;
        }
        .remove-btn {
          position: absolute;
          top: 0;
          right: 0;
          background: none;
          border: none;
          font-size: 18px;
          color: #999;
          cursor: pointer;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .remove-btn:hover {
          color: #dc3545;
        }
        .cart-footer {
          padding: 20px;
          border-top: 1px solid #eee;
        }
        .total {
          font-weight: bold;
          font-size: 18px;
          text-align: center;
        }
        .empty-cart-message {
          text-align: center;
          padding: 40px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
        }
        .empty-cart-icon {
          font-size: 48px;
          margin-bottom: 15px;
          opacity: 0.5;
        }
      `}</style>
    </>
  );
};

export default CartSidebar;