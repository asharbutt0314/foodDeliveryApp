import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CartSidebar from '../Cart/CartSidebar';
import { imageService } from '../../../services/imageService';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cartState, setCartState] = useState({});
  const [showCartSidebar, setShowCartSidebar] = useState(false);

  const backendBaseUrl = 'http://localhost:5000';

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${backendBaseUrl}/products`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
      if (!res.ok) {
        if (res.status >= 500) {
          // Server error, assume backend down, logout user
          localStorage.clear();
          setError('Server unavailable. You have been logged out.');
          setProducts([]);
          setLoading(false);
          navigate('/login');
          return;
        }
        if (res.status === 404) {
          // User not found, clear localStorage and logout
          localStorage.clear();
          setError('Account not found. You have been logged out.');
          setProducts([]);
          setLoading(false);
          navigate('/login');
          return;
        }
        // Prevent infinite loop if response is not JSON
        let errorMessage = 'Failed to fetch products.';
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonErr) {
          // Not JSON, keep default message
        }
        setError(`${errorMessage}`);
        setProducts([]);
      } else {
        const data = await res.json();
        const productsArray = Array.isArray(data) ? data : [];
        setProducts(productsArray);
        setFilteredProducts(productsArray);
      }
    } catch (err) {
      // Network or other error, assume backend down, logout user
      localStorage.clear();
      setError('Server unavailable. You have been logged out.');
      setProducts([]);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter(product => {
      const name = (product.name || product.title || '').toLowerCase();
      const description = (product.description || product.desc || product.details || '').toLowerCase();
      const search = searchTerm.toLowerCase();
      return name.includes(search) || description.includes(search);
    });
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  // Helper to get a valid product ID for edit
  const getValidProductId = (id) => {
    if (!id) return '';
    // Accept string or object, fallback to string conversion
    if (typeof id === 'object') {
      if (id.$oid) return id.$oid;
      if (id.oid) return id.oid;
      // If object, try to stringify
      return String(Object.values(id)[0] || '');
    }
    // Accept any string, fallback to string conversion
    return String(id);
  };


  
  return (
    <div className="container my-5 " > 
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-3">
          <i className="bi bi-utensils" style={{ fontSize: '1.2em', marginRight: '15px' }}></i>
          <span style={{ background: 'linear-gradient(45deg, #FF5722, #FF9800)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Delicious Menu</span>
        </h1>
        <p className="lead" style={{ color: '#666' }}>Fresh ingredients, amazing flavors, delivered to your door!</p>
        
        <div className="row justify-content-center mb-4">
          <div className="col-md-6">
            <div className="input-group" style={{ borderRadius: '25px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
              <span className="input-group-text" style={{ background: 'linear-gradient(45deg, #FF5722, #FF9800)', border: 'none', color: 'white' }}>
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search for delicious food..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ border: 'none', fontSize: '1.1rem', padding: '12px' }}
              />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-center">Loading products...</p>
      ) : error ? (
        <p className="text-center text-danger">{error}</p>
      ) : filteredProducts.length === 0 ? (
        <p className="text-center">{searchTerm ? 'No products match your search.' : 'No products found.'}</p>
      ) : (
        <div className="d-flex flex-wrap justify-content-center gap-4 mt-3">
          {filteredProducts.map((product) => {
            const validId = getValidProductId(product._id);
            const displayName = product.name || product.title;
            if (!validId || !displayName) return null;

            return (
              <div
                key={validId}
                className="product-card card border-0"
                style={{
                  width: '20rem',
                  maxWidth: '100%',
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
                {product.image ? (
                  <img
                    src={imageService.getImageUrl(product.image)}
                    alt={displayName}
                    className="card-img-top"
                    style={{
                      height: '180px',
                      width: '100%',
                      objectFit: 'cover',
                      borderTopLeftRadius: '1rem',
                      borderTopRightRadius: '1rem',
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : (
                  <div 
                    className="card-img-top d-flex align-items-center justify-content-center"
                    style={{
                      height: '180px',
                      background: 'linear-gradient(135deg, #FF5722 0%, #FF9800 100%)',
                      color: 'white',
                      borderTopLeftRadius: '1rem',
                      borderTopRightRadius: '1rem'
                    }}
                  >
                    <i className="bi bi-utensils" style={{ fontSize: '4rem' }}></i>
                  </div>
                )}

                <div className="card-body d-flex flex-column justify-content-between" style={{ minHeight: '200px' }}>
                  <div>
                    <div className="product-price">
                      {product.discount && product.discount > 0 ? (
                        <>
                          <div className="discounted-price">PKR {(product.price * (1 - product.discount / 100)).toFixed(2)}</div>
                          <div className="original-price">PKR {product.price}</div>
                          <div className="discount-badge">{product.discount}% OFF</div>
                        </>
                      ) : (
                        <div className="regular-price">PKR {product.price}</div>
                      )}
                    </div>
                    <h5 className="product-title">
                      {!product.image && <i className="bi bi-utensils" style={{ marginRight: '8px' }}></i>}
                      {displayName}
                    </h5>
                    <p className="card-text text-secondary" style={{ minHeight: '48px' }}>
                      {product.description || product.desc || product.details}
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
                                setShowCartSidebar(true);
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
                          setShowCartSidebar(true);
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
        isOpen={showCartSidebar} 
        onClose={() => {
          setShowCartSidebar(false);
          setCartState({});
        }} 
      />
    </div>
  );
};

export default Products;
