import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../Toast/ToastProvider';
import CartSidebar from '../Cart/CartSidebar';

const Offers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartState, setCartState] = useState({});
  const toast = useToast();

  useEffect(() => {
    fetchDiscountedProducts();
  }, []);

  const fetchDiscountedProducts = async () => {
    try {
      const [productsRes, restaurantsRes] = await Promise.all([
        axios.get('http://localhost:5000/products'),
        axios.get('http://localhost:5000/Clientauth/restaurants')
      ]);
      
      const discountedProducts = productsRes.data.filter(product => product.discount > 0);
      const restaurants = restaurantsRes.data.restaurants || [];
      
      const productsWithRestaurants = discountedProducts.map(product => {
        const restaurant = restaurants.find(r => r._id === product.clientId);
        return {
          ...product,
          restaurantName: restaurant?.restaurantName || 'Unknown Restaurant'
        };
      });
      
      setProducts(productsWithRestaurants);
    } catch (err) {
      console.error('Error fetching products:', err);
      toast.addToast('Failed to load offers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/products/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ productId }),
      });
      if (res.ok) {
        toast.addToast('Added to cart!', 'success');
        setCartOpen(true);
      } else {
        toast.addToast('Failed to add to cart', 'error');
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      toast.addToast('Failed to add to cart', 'error');
    }
  };

  const getImageUrl = (path) => {
    return path ? `http://localhost:5000${path}` : '/placeholder.png';
  };

  const calculateDiscountedPrice = (price, discount) => {
    return (price * (1 - discount / 100)).toFixed(2);
  };

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-warning" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3" style={{ color: '#FF5722' }}>Loading amazing offers...</p>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold" style={{ color: '#FF5722' }}>
          <i className="bi bi-fire"></i> Hot Deals & Offers
        </h1>
        <p className="lead" style={{ color: '#666' }}>Save big on your favorite dishes!</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-5">
          <h3 style={{ color: '#FF9800' }}><i className="bi bi-bullseye"></i> No offers available right now</h3>
          <p className="text-muted">Check back later for amazing deals!</p>
        </div>
      ) : (
        <div className="d-flex flex-wrap justify-content-center gap-4 mt-3">
          {products.map((product) => {
            const validId = product._id;
            return (
              <div
                key={validId}
                className="product-card card border-0"
                style={{
                  width: '20rem',
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  transition: 'box-shadow 0.25s ease, transform 0.25s ease',
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                  e.currentTarget.style.transform = 'translateY(-5px) scale(1.015)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <div className="position-relative">
                  {product.image && (
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      className="card-img-top"
                      style={{
                        height: '180px',
                        width: '100%',
                        objectFit: 'cover',
                        borderTopLeftRadius: '1rem',
                        borderTopRightRadius: '1rem',
                      }}
                    />
                  )}
                  <div className="position-absolute top-0 end-0 m-2">
                    <span className="badge" style={{ 
                      background: 'linear-gradient(45deg, #FF5722, #FF9800)', 
                      fontSize: '14px', 
                      padding: '8px 12px',
                      borderRadius: '20px'
                    }}>
                      <i className="bi bi-tag"></i> {product.discount}% OFF
                    </span>
                  </div>
                </div>

                <div className="card-body d-flex flex-column justify-content-between" style={{ minHeight: '200px' }}>
                  <div>
                    <div className="product-price">
                      <div className="discounted-price">PKR {calculateDiscountedPrice(product.price, product.discount)}</div>
                      <div className="original-price">PKR {product.price}</div>
                      <div className="discount-badge">{product.discount}% OFF</div>
                    </div>
                    <h5 className="product-title">{product.name}</h5>
                    <p className="text-muted small mb-1">{product.restaurantName}</p>
                    <p className="card-text text-secondary" style={{ minHeight: '48px' }}>
                      {product.description}
                    </p>
                  </div>

                  <div className="d-flex flex-column gap-3">
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      background: '#f8f9fa',
                      padding: '5px 10px',
                      borderRadius: '20px',
                      width: 'fit-content',
                      margin: '0 auto'
                    }}>
                      <button
                        onClick={() => {
                          setCartState(prev => {
                            const currentQty = prev[validId]?.quantity || 0;
                            const newQty = Math.max(0, currentQty - 1);
                            return { ...prev, [validId]: { quantity: newQty } };
                          });
                        }}
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
                      }}>
                        {cartState[validId]?.quantity || 0}
                      </span>
                      <button
                        onClick={() => {
                          setCartState(prev => {
                            const currentQty = prev[validId]?.quantity || 0;
                            return { ...prev, [validId]: { quantity: currentQty + 1 } };
                          });
                        }}
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
                    <button
                      className="btn-add-cart w-100"
                      onClick={async () => {
                        try {
                          const token = localStorage.getItem('token');
                          const quantity = cartState[validId]?.quantity || 0;
                          
                          if (quantity === 0) {
                            alert('Please select quantity first');
                            return;
                          }
                          
                          for (let i = 0; i < quantity; i++) {
                            const response = await fetch('http://localhost:5000/products/cart/add', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                                'Authorization': token ? `Bearer ${token}` : '',
                              },
                              body: JSON.stringify({ productId: validId }),
                            });
                            
                            if (!response.ok) {
                              const errorData = await response.json();
                              if (response.status === 400 && errorData.message.includes('restaurant')) {
                                setCartOpen(true);
                              } else {
                                alert(errorData.message || 'Failed to add to cart');
                              }
                              return;
                            }
                          }
                          
                          setCartState(prev => {
                            const newState = { ...prev };
                            delete newState[validId];
                            return newState;
                          });
                          window.dispatchEvent(new Event('cartUpdated'));
                          setCartOpen(true);
                        } catch (error) {
                          console.error('Error adding to cart:', error);
                          alert('Network error. Please try again.');
                        }
                      }}
                    >
                      <i className="bi bi-cart-plus"></i> Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <CartSidebar 
        isOpen={cartOpen} 
        onClose={() => {
          setCartOpen(false);
          setCartState({});
        }} 
      />
    </div>
  );
};

export default Offers;
  