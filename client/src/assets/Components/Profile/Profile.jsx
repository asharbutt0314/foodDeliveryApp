import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../Toast/ToastProvider';

const Profile = () => {
  const [user, setUser] = useState({ username: '', restaurantName: '', email: '', restaurantImage: '' });
  const [username, setUsername] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setUsername(parsedUser.username || '');
      setRestaurantName(parsedUser.restaurantName || '');
      setImage(parsedUser.restaurantImage || null);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log("User object before update:", user);
    if (!user || !user._id) {
      alert("User ID is missing. Please reload the page or login again.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('restaurantName', restaurantName);
      formData.append('clientId', user._id);
      if (password) {
        formData.append('password', password);
      }
      if (image) {
        formData.append('restaurantImage', image);
      }

      const res = await axios.put('http://localhost:5000/Clientauth/update-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.success) {
        // Show custom success message
        toast.addToast('Profile updated successfully!', 'success');
        // Also update local storage user info
        const updatedUser = { ...user, username, restaurantName };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setPassword('');
        // Redirect to products page
        navigate('/products');
      } else {
        // Show custom error message from server as alert instead of toast
        alert(res.data.message || 'Failed to update profile');
      }
    } catch (err) {
      toast.addToast(err.response?.data?.message || 'Server error during profile update', 'error');
      alert(err.response?.data?.message || 'Server error during profile update'); 
     
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8">
          <div className="card shadow-lg border-0" style={{ borderRadius: '20px', overflow: 'hidden' }}>
            <div className="card-header text-white text-center py-4" style={{ background: 'linear-gradient(135deg, #FF5722 0%, #FF9800 100%)' }}>
              <h2 className="mb-0">
                <i className="bi bi-person" style={{ fontSize: '1.2em', marginRight: '10px' }}></i>
                Update Profile
              </h2>
              <p className="mb-0 mt-2" style={{ opacity: '0.9' }}>Manage your restaurant information</p>
            </div>
            
            <div className="card-body p-4" style={{ background: 'linear-gradient(145deg, #ffffff, #f8f9fa)' }}>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label fw-bold" style={{ color: '#FF5722' }}><i className="bi bi-envelope"></i> Email Address</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    value={user.email} 
                    readOnly 
                    style={{ 
                      borderRadius: '15px', 
                      border: '2px solid #e0e0e0', 
                      padding: '12px 20px',
                      fontSize: '16px',
                      backgroundColor: '#f5f5f5'
                    }}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="form-label fw-bold" style={{ color: '#FF5722' }}><i className="bi bi-person"></i> Owner Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={{ 
                      borderRadius: '15px', 
                      border: '2px solid #FFE0B2', 
                      padding: '12px 20px',
                      fontSize: '16px'
                    }}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="form-label fw-bold" style={{ color: '#FF5722' }}><i className="bi bi-shop"></i> Restaurant Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                    required
                    style={{ 
                      borderRadius: '15px', 
                      border: '2px solid #FFE0B2', 
                      padding: '12px 20px',
                      fontSize: '16px'
                    }}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="form-label fw-bold" style={{ color: '#FF5722' }}><i className="bi bi-image"></i> Restaurant Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control"
                    onChange={(e) => setImage(e.target.files[0])}
                    style={{ 
                      borderRadius: '15px', 
                      border: '2px solid #FFE0B2', 
                      padding: '12px 20px',
                      fontSize: '16px'
                    }}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="form-label fw-bold" style={{ color: '#FF5722' }}><i className="bi bi-lock"></i> New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Leave blank to keep current password"
                    style={{ 
                      borderRadius: '15px', 
                      border: '2px solid #FFE0B2', 
                      padding: '12px 20px',
                      fontSize: '16px'
                    }}
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-lg w-100" 
                  disabled={loading}
                  style={{
                    background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '25px',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    padding: '12px',
                    boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
                  }}
                >
                  {loading ? <><i className="bi bi-arrow-repeat"></i> Updating...</> : <><i className="bi bi-check-circle"></i> Update Profile</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
