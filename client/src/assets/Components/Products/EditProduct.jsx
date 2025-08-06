import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../Toast/ToastProvider';
import API_BASE_URL from '../../../config/api';
import { imageService } from '../../../services/imageService';

const EditProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({ name: '', price: '', description: '', image: '', discount: 0 });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/products/getproduct/${id}`);
        setProduct({
          name: res.data.name || res.data.title || '',
          price: res.data.price || '',
          description: res.data.description || res.data.desc || res.data.details || '',
          image: res.data.image || '',
          discount: res.data.discount || 0
        });
      } catch (err) {
        setError('Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id) {
      setError('No product ID found.');
      toast.addToast('No product ID found.', 'error');
      return;
    }
    if (!product.name || !product.price || !product.description) {
      setError('All fields are required.');
      toast.addToast('All fields are required.', 'error');
      return;
    }
    const user = JSON.parse(localStorage.getItem('user'));
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('price', product.price);
    formData.append('description', product.description);
    formData.append('discount', product.discount);
    formData.append('clientId', user._id);
    if (image) {
      formData.append('image', image);
    }
    setLoading(true);
    try {
      await axios.put(`${API_BASE_URL}/products/editproduct/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setError('');
      toast.addToast('Product updated successfully!', 'success');
      // alert('Product Updated Successfully');
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product');
      toast.addToast(err.response?.data?.message || 'Failed to update product', 'error');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (path) => {
    return path ? imageService.getImageUrl(path) : '/placeholder.png';
  };

  if (loading) return (
    <div className="container my-5 text-center">
      <div className="spinner-border text-warning" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3" style={{ color: '#FF5722' }}>Loading product details...</p>
    </div>
  );
  
  if (error) return (
    <div className="container my-5">
      <div className="alert alert-danger text-center" style={{ borderRadius: '15px', border: '2px solid #f44336' }}>
        <h4><i className="bi bi-x-circle"></i> Error</h4>
        <p className="mb-0">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">
          <div className="card shadow-lg border-0" style={{ borderRadius: '20px', overflow: 'hidden' }}>
            <div className="card-header text-white text-center py-4" style={{ background: 'linear-gradient(135deg, #FF5722 0%, #FF9800 100%)' }}>
              <h2 className="mb-0">
                <i className="bi bi-pencil" style={{ fontSize: '1.2em', marginRight: '10px' }}></i>
                Edit Product
              </h2>
              <p className="mb-0 mt-2" style={{ opacity: '0.9' }}>Update your delicious menu item</p>
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
                      {product.image && typeof product.image === 'string' && (
                        <div className="mt-3">
                          <p className="small text-muted mb-2">Current Image:</p>
                          <img
                            src={getImageUrl(product.image)}
                            alt={product.name}
                            className="img-fluid rounded shadow-sm"
                            onError={e => { e.target.onerror = null; e.target.src = '/placeholder.png'; }}
                            style={{ 
                              maxHeight: '200px', 
                              objectFit: 'cover', 
                              borderRadius: '15px',
                              border: '3px solid #FFE0B2'
                            }}
                          />
                        </div>
                      )}
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
                    {loading ? <><i className="bi bi-arrow-clockwise"></i> Updating...</> : <><i className="bi bi-check-circle"></i> Update Product</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
