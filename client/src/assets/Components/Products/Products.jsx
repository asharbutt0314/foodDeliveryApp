import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DeleteProduct from './DeleteProduct';
import API_BASE_URL from '../../../config/api';
import { imageService } from '../../../services/imageService';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');;

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      const res = await fetch(`${API_BASE_URL}/products/client/${user._id}`, {
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
          // Client not found, clear localStorage and logout
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
      const image = (product.image || '').toLowerCase();
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

  // const getImageUrl = (imagePath) => {
  //   if (!imagePath) return null;
  //   if (imagePath.startsWith('http')) return imagePath;
  //   return `${API_BASE_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  // };
  
  return (
    <div className="container my-5 " > 
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-3">
          <i className="bi bi-utensils" style={{ fontSize: '1.2em', marginRight: '15px' }}></i>
          <span style={{ background: 'linear-gradient(45deg, #FF5722, #FF9800)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Product Management</span>
        </h1>
        <p className="lead" style={{ color: '#666' }}>Manage your restaurant's delicious offerings</p>
        
        <div className="row justify-content-center mb-4">
          <div className="col-md-6">
            <div className="input-group" style={{ borderRadius: '25px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
              <span className="input-group-text" style={{ background: 'linear-gradient(45deg, #FF5722, #FF9800)', border: 'none', color: 'white' }}>
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search products..."
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
        <div className="row g-4">
          {filteredProducts.map((product) => {
            const validId = getValidProductId(product._id);
            const displayName = product.name || product.title;
            if (!validId || !displayName) return null;

            return (
              <div key={validId} className="col-lg-4 col-md-6">
                <div className="card h-100 shadow-lg" style={{ borderRadius: '20px', border: 'none', overflow: 'hidden', background: 'linear-gradient(145deg, #ffffff, #f8f9fa)', maxWidth: '100%' }}>
                <div className="position-relative">
                  {product.image ? (
                    <img
                      src={imageService.getImageUrl(product.image)}
                      alt={displayName}
                      className="card-img-top"
                      style={{
                        height: '200px',
                        width: '100%',
                        objectFit: 'cover',
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
                        height: '200px',
                        background: 'linear-gradient(135deg, #FF5722 0%, #FF9800 100%)',
                        color: 'white'
                      }}
                    >
                      <i className="bi bi-utensils" style={{ fontSize: '4rem' }}></i>
                    </div>
                  )}
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
                </div>

                <div className="card-body d-flex flex-column p-4">
                  <h5 className="card-title fw-bold mb-3" style={{ color: '#FF5722', fontSize: '1.3rem' }}>
                    {!product.image && <i className="bi bi-utensils" style={{ marginRight: '8px' }}></i>}
                    {displayName}
                  </h5>
                  <p className="card-text text-muted mb-3 flex-grow-1" style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>
                    {product.description || product.desc || product.details || 'No description available'}
                  </p>
                  
                  <div className="d-flex gap-2 mt-auto">
                    <button
                      className="btn btn-sm flex-fill"
                      onClick={() => navigate(`/editproduct/${validId}`)}
                      style={{
                        background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '15px',
                        fontWeight: 'bold',
                        padding: '8px 16px',
                        boxShadow: '0 2px 10px rgba(33, 150, 243, 0.3)'
                      }}
                    >
                      <i className="bi bi-pencil"></i> Edit
                    </button>
                    <DeleteProduct
                      productId={validId}
                      onDeleteSuccess={(deletedId) => {
                        const updatedProducts = products.filter((p) => getValidProductId(p._id) !== deletedId);
                        setProducts(updatedProducts);
                        setFilteredProducts(updatedProducts.filter(product => {
                          const name = (product.name || product.title || '').toLowerCase();
                          const description = (product.description || product.desc || product.details || '').toLowerCase();
                          const search = searchTerm.toLowerCase();
                          return name.includes(search) || description.includes(search);
                        }));
                      }}
                      buttonClassName="btn btn-sm flex-fill"
                      buttonStyle={{
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
                    />
                  </div>
                </div>
              </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Products;
