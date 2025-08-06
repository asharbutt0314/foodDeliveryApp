import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    const filtered = restaurants.filter(restaurant => {
      const name = (restaurant.restaurantName || '').toLowerCase();
      const owner = (restaurant.username || '').toLowerCase();
      const search = searchTerm.toLowerCase();
      return name.includes(search) || owner.includes(search);
    });
    setFilteredRestaurants(filtered);
  }, [searchTerm, restaurants]);

  const fetchRestaurants = async () => {
    try {
      const res = await axios.get('http://localhost:5000/Clientauth/restaurants');
      if (res.data.success) {
        const restaurantList = res.data.restaurants;
        setRestaurants(restaurantList);
        setFilteredRestaurants(restaurantList);
      }
    } catch (err) {
      console.error('Error fetching restaurants:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRestaurantClick = (restaurantId) => {
    navigate(`/restaurant/${restaurantId}/products`);
  };

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-warning" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3" style={{ color: '#FF5722' }}>Loading restaurants...</p>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-3">
          <i className="bi bi-utensils" style={{ fontSize: '1.2em', marginRight: '15px' }}></i>
          <span style={{ background: 'linear-gradient(45deg, #FF5722, #FF9800)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Available Restaurants</span>
        </h1>
        <p className="lead" style={{ color: '#666' }}>Choose your favorite restaurant</p>
        
        <div className="row justify-content-center mb-4">
          <div className="col-md-6">
            <div className="input-group" style={{ borderRadius: '25px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
              <span className="input-group-text" style={{ background: 'linear-gradient(45deg, #FF5722, #FF9800)', border: 'none', color: 'white' }}>
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search restaurants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ border: 'none', fontSize: '1.1rem', padding: '12px' }}
              />
            </div>
          </div>
        </div>
      </div>

      {filteredRestaurants.length === 0 ? (
        <div className="text-center py-5">
          <h3 style={{ color: '#FF9800' }}><i className="bi bi-shop"></i> {searchTerm ? 'No restaurants match your search' : 'No restaurants available'}</h3>
          <p className="text-muted">{searchTerm ? 'Try a different search term' : 'Check back later for new restaurants!'}</p>
        </div>
      ) : (
        <div className="row g-4">
          {filteredRestaurants.map((restaurant) => (
            <div key={restaurant._id} className="col-lg-4 col-md-6">
              <div 
                className="card h-100 shadow-lg border-0" 
                style={{ 
                  borderRadius: '20px', 
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}
                onClick={() => handleRestaurantClick(restaurant._id)}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 87, 34, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                }}
              >
                <div className="position-relative">
                  {restaurant.restaurantImage ? (
                    <img
                      src={`http://localhost:5000${restaurant.restaurantImage}`}
                      alt={restaurant.restaurantName}
                      className="card-img-top"
                      style={{
                        height: '200px',
                        objectFit: 'cover',
                      }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      if (e.target.nextSibling) {
                        e.target.nextSibling.style.display = 'flex';
                      }
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
                </div>

                <div className="card-body p-4" style={{ background: 'linear-gradient(145deg, #ffffff, #f8f9fa)' }}>
                  <h5 className="card-title text-center mb-3" style={{ color: '#FF5722', fontWeight: 'bold' }}>
                    {restaurant.restaurantName}
                  </h5>
                  <p className="text-muted text-center small mb-3">
                    Owner: {restaurant.username}
                  </p>
                  
                  <div className="text-center">
                    <button
                      className="btn btn-lg"
                      style={{
                        background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '25px',
                        fontWeight: 'bold',
                        padding: '10px 30px'
                      }}
                    >
                      <i className="bi bi-list"></i> View Menu
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Restaurants;