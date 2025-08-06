import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CartSidebar from '../Cart/CartSidebar';
import { imageService } from '../../../services/imageService';
import '../Products/Products.css';

const RestaurantProducts = () => {
  const { restaurantId } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [restaurant, setRestaurant] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cartState, setCartState] = useState({});
  const [showCartSidebar, setShowCartSidebar] = useState(false);

  const backendBaseUrl = 'http://localhost:5000';

  const fetchRestaurantProducts = async () => {
    try {
      const [productsRes, restaurantRes] = await Promise.all([
        fetch(`${backendBaseUrl}/products/client/${restaurantId}`),
        fetch(`${backendBaseUrl}/Clientauth/restaurants`)
      ]);

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        const productsArray = Array.isArray(productsData) ? productsData : [];
        setProducts(productsArray);
        setFilteredProducts(productsArray);
      }
      
      if (restaurantRes.ok) {
        const restaurantData = await restaurantRes.json();
        if (restaurantData.success) {
          const currentRestaurant = restaurantData.restaurants.find(r => r._id === restaurantId);
          setRestaurant(currentRestaurant);
        }
      }
    } catch (err) {
      console.error('Error fetching restaurant products:', err);
      if (err.response?.status === 404) {
        localStorage.clear();
        setError('Restaurant not found. Redirecting to login.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError('Failed to load restaurant products');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurantProducts();
  }, [restaurantId]);

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
    if (typeof id === 'object') {
      if (id.$oid) return id.$oid;
      if (id.oid) return id.oid;
      return String(Object.values(id)[0] || '');
    }
    return String(id);
  };


  
  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-warning" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3" style={{ color: '#FF5722' }}>Loading menu...</p>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="text-center mb-5">
        <button 
          onClick={() => navigate('/restaurants')}
          className="btn mb-3"
          style={{
            background: 'linear-gradient(45deg, #666, #999)',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            padding: '8px 20px'
          }}
        >
          ← Back to Restaurants
        </button>
        
        <h1 className="display-4 fw-bold mb-3">
          <i className="bi bi-utensils" style={{ fontSize: '1.2em', marginRight: '15px' }}></i>
          <span style={{ background: 'linear-gradient(45deg, #FF5722, #FF9800)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {restaurant?.restaurantName || 'Restaurant Menu'}
          </span>
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
                placeholder="Search menu items..."
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
        <div className="text-center py-5">
          <h3 style={{ color: '#FF9800' }}><i className="bi bi-utensils"></i> {searchTerm ? 'No menu items match your search' : 'No menu items available'}</h3>
          <p className="text-muted">{searchTerm ? 'Try a different search term' : 'This restaurant hasn\'t added any products yet!'}</p>
        </div>
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
                      borderTopRightRadius: '1rem'
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
                            return newState;
                          });
                          window.dispatchEvent(new Event('cartUpdated'));
                          setShowCartSidebar(true);
                        } catch (error) {
                          console.error('Error adding to cart:', error);
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

export default RestaurantProducts;