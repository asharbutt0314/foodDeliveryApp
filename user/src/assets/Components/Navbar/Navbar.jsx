import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  const fetchCartCount = async () => {
    const currentUser = localStorage.getItem('user');
    if (!currentUser) {
      setCartCount(0);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/products/cart', {
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      });
      if (res.ok) {
        const cartItems = await res.json();
        const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(totalCount);
      } else {
        setCartCount(0);
      }
    } catch (err) {
      console.error('Failed to fetch cart count');
      setCartCount(0);
    }
  };

  useEffect(() => {
    const fetchUser = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
      if (storedUser) {
        fetchCartCount();
      }
    };

    const handleCartUpdate = () => {
      fetchCartCount();
    };

    // Initial check
    fetchUser();

    // Listen to login/logout events
    window.addEventListener("userLogin", fetchUser);
    window.addEventListener("userLogout", fetchUser);
    window.addEventListener("storage", fetchUser);
    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("userLogin", fetchUser);
      window.removeEventListener("userLogout", fetchUser);
      window.removeEventListener("storage", fetchUser);
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  useEffect(() => {
    if (user) {
      fetchCartCount();
    } else {
      setCartCount(0);
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    window.dispatchEvent(new Event("userLogout"));
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light sticky-top py-3" style={{ background: 'linear-gradient(135deg, #FF5722 0%, #FF9800 100%)', boxShadow: '0 4px 20px rgba(255, 87, 34, 0.3)' }}>
      <div className="container">
        <a className="navbar-brand fw-bold fs-3 text-white" href="/restaurants" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
          <i className="bi bi-shop"></i> FoodExpress
        </a>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav align-items-center gap-3">
            {user ? (
              <>
                <li className="nav-item">
                  <button className="btn btn-link nav-link fw-semibold p-0 text-white" onClick={() => navigate('/restaurants')} style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                    <i className="bi bi-building"></i> Restaurants
                  </button>
                </li>
                <li className="nav-item">
                  <button className="btn btn-link nav-link fw-semibold p-0 text-white" onClick={() => navigate('/offers')} style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                    <i className="bi bi-percent"></i> Offers
                  </button>
                </li>
                <li className="nav-item position-relative">
                  <button className="btn btn-link nav-link fw-semibold p-0 text-white" onClick={() => navigate('/cart')} style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                    <i className="bi bi-cart"></i> Cart
                    {cartCount > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.7rem' }}>
                        {cartCount}
                      </span>
                    )}
                  </button>
                </li>
                <li className="nav-item">
                  <button className="btn btn-link nav-link fw-semibold p-0 text-white" onClick={() => navigate('/recent-orders')} style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                    <i className="bi bi-list-ul"></i> Orders
                  </button>
                </li>
                <li className="nav-item">
                  <button className="btn btn-link nav-link fw-semibold p-0 text-white" onClick={() => navigate('/profile')} style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                    <i className="bi bi-person"></i> {user.username}
                  </button>
                </li>
                <li className="nav-item">
                  <button className="btn rounded-pill px-4 py-2" onClick={handleLogout} style={{ background: 'white', color: '#FF5722', fontWeight: 'bold', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <a className="nav-link fw-semibold text-white" href="/login" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>Login</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link fw-semibold text-white" href="/signup" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>Signup</a>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
