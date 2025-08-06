import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [orderCount, setOrderCount] = useState(0);
  const navigate = useNavigate();

  // Fetch order count for notifications
  const fetchOrderCount = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        const res = await fetch(`http://localhost:5000/orders/client/${userData._id}`);
        if (res.ok) {
          const orders = await res.json();
          const pendingOrders = orders.filter(order => order.status === 'pending');
          setOrderCount(pendingOrders.length || 0);
        }
      }
    } catch (err) {
      console.error('Failed to fetch order count:', err);
    }
  };

  useEffect(() => {
    const fetchUser = () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
          setUser(JSON.parse(storedUser));
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user");
        setUser(null);
      }
    };

    // Initial check
    fetchUser();

    // Listen to login/logout events
    window.addEventListener("userLogin", fetchUser);
    window.addEventListener("userLogout", fetchUser);
    window.addEventListener("storage", fetchUser);
    
    fetchOrderCount();
    const interval = setInterval(fetchOrderCount, 10000);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener("userLogin", fetchUser);
      window.removeEventListener("userLogout", fetchUser);
      window.removeEventListener("storage", fetchUser);
    };


  }, []);

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
        <a className="navbar-brand fw-bold fs-3 text-white" href="/" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
          <i className="bi bi-shop" style={{ fontSize: '1.2em', marginRight: '10px' }}></i>
          {user?.restaurantName || 'FoodExpress Admin'}
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
                  <button className="btn btn-link nav-link fw-semibold p-0 text-white" onClick={() => navigate('/products')} style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                    <i className="bi bi-utensils"></i> Products
                  </button>
                </li>
                <li className="nav-item">
                  <button className="btn btn-link nav-link fw-semibold p-0 text-white" onClick={() => navigate('/addproduct')} style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                    <i className="bi bi-plus-circle"></i> Add Product
                  </button>
                </li>
                <li className="nav-item position-relative">
                  <button className="btn btn-link nav-link fw-semibold p-0 text-white" onClick={() => { navigate('/orders'); setOrderCount(0); }} style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                    <i className="bi bi-list-ul"></i> Orders
                    {orderCount > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.7rem' }}>
                        {orderCount}
                      </span>
                    )}
                  </button>
                </li>

                <li className="nav-item">
                  <button className="btn btn-link nav-link fw-semibold p-0 text-white" onClick={() => navigate('/profile')} style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                    <i className="bi bi-person"></i> {user.restaurantName}
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
