import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../Toast/ToastProvider';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [productsMap, setProductsMap] = useState({});
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [allergies, setAllergies] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/products/cart', {
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      });
      if (res.ok) {
        const data = await res.json();
        setCartItems(data);

        if (data.length > 0) {
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
      }
    } catch (err) {
      console.error('Failed to fetch cart');
    }
  };

  const calculateDiscountedPrice = (price, discount) => {
    return discount > 0 ? price * (1 - discount / 100) : price;
  };

  const totalAmount = cartItems.reduce((sum, item) => {
    const product = productsMap[item.productId];
    if (product) {
      const discountedPrice = calculateDiscountedPrice(product.price, product.discount || 0);
      return sum + (discountedPrice * item.quantity);
    }
    return sum;
  }, 0);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!deliveryAddress || !city || !phone) {
      toast.addToast('Please fill all required fields', 'error');
      return;
    }
    if (phone.length !== 11) {
      toast.addToast('Phone number must be exactly 11 digits', 'error');
      return;
    }

    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const orderData = {
        userId: user._id,
        items: cartItems,
        deliveryAddress,
        city,
        phone,
        allergies,
        paymentMethod
      };

      const res = await axios.post('http://localhost:5000/orders/create', orderData);
      if (res.data.success) {
        // Clear cart after successful order
        const token = localStorage.getItem('token');
        await fetch('http://localhost:5000/products/cart/clear', {
          method: 'DELETE',
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
          },
        });
        // Clear local cart state
        setCartItems([]);
        // Clear cart count in navbar with slight delay
        setTimeout(() => {
          window.dispatchEvent(new Event('cartUpdated'));
        }, 100);
        toast.addToast('Order placed successfully!', 'success');
        navigate('/order-confirmation', { state: { order: res.data.order }, replace: true });
      }
    } catch (err) {
      toast.addToast('Failed to place order', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container my-5 text-center">
        <h3 className="text-muted"><i className="bi bi-cart"></i> Your cart is empty</h3>
        <button onClick={() => navigate('/products')} className="btn btn-primary mt-3">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-lg-8">
          <div className="card shadow-lg border-0" style={{ borderRadius: '20px' }}>
            <div className="card-header text-white text-center py-4" style={{ background: 'linear-gradient(135deg, #FF5722 0%, #FF9800 100%)' }}>
              <h2 className="mb-0"><i className="bi bi-credit-card"></i> Checkout</h2>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleCheckout}>
                <div className="row">
                  <div className="col-md-8 mb-4">
                    <label className="form-label fw-bold" style={{ color: '#FF5722' }}><i className="bi bi-geo-alt"></i> Delivery Address</label>
                    <textarea
                      className="form-control"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      required
                      rows="2"
                      style={{ borderRadius: '15px', border: '2px solid #FFE0B2', padding: '12px 20px' }}
                      placeholder="House/Building, Street, Area"
                    />
                  </div>
                  <div className="col-md-4 mb-4">
                    <label className="form-label fw-bold" style={{ color: '#FF5722' }}><i className="bi bi-building"></i> City</label>
                    <input
                      type="text"
                      className="form-control"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      style={{ borderRadius: '15px', border: '2px solid #FFE0B2', padding: '12px 20px' }}
                      placeholder="Your city"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="form-label fw-bold" style={{ color: '#FF5722' }}><i className="bi bi-telephone"></i> Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 11) {
                        setPhone(value);
                      }
                    }}
                    required
                    maxLength="11"
                    minLength="11"
                    style={{ borderRadius: '15px', border: '2px solid #FFE0B2', padding: '12px 20px' }}
                    placeholder="03xxxxxxxxx"
                  />
                  <small className="text-muted">Enter exactly 11 digits</small>
                </div>
                <div className="mb-4">
                  <label className="form-label fw-bold" style={{ color: '#FF5722' }}><i className="bi bi-exclamation-triangle"></i> Allergies/Special Instructions</label>
                  <textarea
                    className="form-control"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    rows="2"
                    style={{ borderRadius: '15px', border: '2px solid #FFE0B2', padding: '12px 20px' }}
                    placeholder="Any food allergies or special cooking instructions (optional)"
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-bold" style={{ color: '#FF5722' }}><i className="bi bi-credit-card"></i> Payment Method</label>
                  <div className="d-flex gap-3 mt-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="cash"
                        value="cash"
                        checked={paymentMethod === 'cash'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        style={{ transform: 'scale(1.2)' }}
                      />
                      <label className="form-check-label fw-bold" htmlFor="cash" style={{ color: '#4CAF50', marginLeft: '8px' }}>
                        <i className="bi bi-cash"></i> Cash on Delivery
                      </label>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-lg w-100"
                  style={{
                    background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '25px',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    padding: '12px'
                  }}
                >
                  {loading ? <><i className="bi bi-arrow-clockwise"></i> Placing Order...</> : <><i className="bi bi-check-circle"></i> Place Order</>}
                </button>
              </form>
            </div>
          </div>
        </div>
        
        <div className="col-lg-4">
          <div className="card shadow-lg border-0" style={{ borderRadius: '20px' }}>
            <div className="card-header text-white text-center py-3" style={{ background: 'linear-gradient(135deg, #FF5722 0%, #FF9800 100%)' }}>
              <h4 className="mb-0"><i className="bi bi-list-ul"></i> Order Summary</h4>
            </div>
            <div className="card-body p-3">
              {cartItems.map((item, index) => {
                const product = productsMap[item.productId];
                if (!product) return null;
                const discountedPrice = calculateDiscountedPrice(product.price, product.discount || 0);
                return (
                  <div key={index} className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                    <div>
                      <h6 className="mb-0">{product.name}</h6>
                      <small className="text-muted d-block">{item.restaurantName || product.restaurantName}</small>
                      <small className="text-muted">Qty: {item.quantity}</small>
                    </div>
                    <div className="text-end">
                      {product.discount > 0 ? (
                        <>
                          <div><small className="text-decoration-line-through text-muted">PKR {product.price}</small></div>
                          <div className="text-success fw-bold">PKR {discountedPrice.toFixed(2)}</div>
                        </>
                      ) : (
                        <div className="text-success fw-bold">PKR {product.price}</div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div className="mt-3 pt-3 border-top">
                <div className="d-flex justify-content-between">
                  <h5>Total:</h5>
                  <h5 className="text-success">PKR {totalAmount.toFixed(2)}</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;