import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../../config/api';

const AddProduct = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
    discount: 0
  });
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const formData = new FormData();
      formData.append('name', product.name);
      formData.append('price', Number(product.price));
      formData.append('description', product.description);
      formData.append('discount', product.discount);
      formData.append('clientId', user._id);
      if (image) {
        formData.append('image', image);
      }

      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/products/addproduct`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: formData
      });

      if (!res.ok) {
        let data = {};
        try {
          data = await res.json();
        } catch (err) {
          setMessage(`Failed to add: Unknown error. Status: ${res.status}`);
          return;
        }
        setMessage(`Failed to add: ${data.message || 'Unknown error'} (Status: ${res.status})`);
        return;
      }

      const data = await res.json();
      setMessage('Product added successfully!');
      setProduct({ name: '', price: '', description: '', discount: 0 });
      setImage(null);
      navigate('/products');
    } catch (err) {
      setMessage('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">
          <div className="card shadow-lg border-0" style={{ borderRadius: '20px', overflow: 'hidden' }}>
            <div className="card-header text-white text-center py-4" style={{ background: 'linear-gradient(135deg, #FF5722 0%, #FF9800 100%)' }}>
              <h2 className="mb-0">
                <i className="bi bi-plus-circle" style={{ fontSize: '1.2em', marginRight: '10px' }}></i>
                Add New Product
              </h2>
              <p className="mb-0 mt-2" style={{ opacity: '0.9' }}>Create a delicious menu item</p>
            </div>
            
            <div className="card-body p-4" style={{ background: 'linear-gradient(145deg, #ffffff, #f8f9fa)' }}>
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-4">
                      <label className="form-label fw-bold" style={{ color: '#FF5722' }}><i className="bi bi-utensils"></i> Product Name</label>
                      <input 
                        type="text" 
                        name="name" 
                        className="form-control" 
                        value={product.name} 
                        onChange={handleChange} 
                        required 
                        style={{ 
                          borderRadius: '15px', 
                          border: '2px solid #FFE0B2', 
                          padding: '12px 20px',
                          fontSize: '16px'
                        }}
                        placeholder="Enter product name"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="form-label fw-bold" style={{ color: '#FF5722' }}><i className="bi bi-currency-dollar"></i> Price (PKR)</label>
                      <input 
                        type="number" 
                        name="price" 
                        className="form-control" 
                        value={product.price} 
                        onChange={handleChange} 
                        required 
                        style={{ 
                          borderRadius: '15px', 
                          border: '2px solid #FFE0B2', 
                          padding: '12px 20px',
                          fontSize: '16px'
                        }}
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="form-label fw-bold" style={{ color: '#FF5722' }}><i className="bi bi-tag"></i> Discount (%)</label>
                      <input 
                        type="number" 
                        name="discount" 
                        className="form-control" 
                        value={product.discount} 
                        onChange={handleChange} 
                        min="0"
                        max="100"
                        style={{ 
                          borderRadius: '15px', 
                          border: '2px solid #FFE0B2', 
                          padding: '12px 20px',
                          fontSize: '16px'
                        }}
                        placeholder="0"
                      />
                      <small className="text-muted">Enter discount percentage (0-100)</small>
                    </div>
                    
                    <div className="mb-4">
                      <label className="form-label fw-bold" style={{ color: '#FF5722' }}><i className="bi bi-card-text"></i> Description</label>
                      <textarea 
                        name="description" 
                        className="form-control" 
                        value={product.description} 
                        onChange={handleChange} 
                        required 
                        rows="4"
                        style={{ 
                          borderRadius: '15px', 
                          border: '2px solid #FFE0B2', 
                          padding: '12px 20px',
                          fontSize: '16px',
                          resize: 'vertical'
                        }}
                        placeholder="Describe your delicious product..."
                      />
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="mb-4">
                      <label className="form-label fw-bold" style={{ color: '#FF5722' }}><i className="bi bi-image"></i> Product Image</label>
                      <input 
                        type="file" 
                        name="image" 
                        className="form-control" 
                        onChange={handleImageChange} 
                        accept="image/*" 
                        style={{ 
                          borderRadius: '15px', 
                          border: '2px solid #FFE0B2', 
                          padding: '12px 20px'
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="text-center mt-4">
                  <button 
                    type="submit" 
                    className="btn btn-lg px-5 py-3" 
                    disabled={loading}
                    style={{
                      background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '25px',
                      fontWeight: 'bold',
                      fontSize: '18px',
                      boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 25px rgba(76, 175, 80, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.3)';
                    }}
                  >
                    {loading ? <><i className="bi bi-arrow-repeat"></i> Adding...</> : <><i className="bi bi-check-circle"></i> Add Product</>}
                  </button>
                </div>
                
                {message && (
                  <div className="alert alert-info text-center mt-3" style={{ borderRadius: '15px', border: '2px solid #2196F3' }}>
                    {message}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
