import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './assets/Components/Navbar/Navbar';
import Footer from './assets/Components/Footer/Footer';
import './App.css';
import Products from './assets/Components/Products/Products';
import Offers from './assets/Components/Offers/Offers';
import Contact from './assets/Components/Contact/Contact';
import Login from './assets/Components/Login/Login';
import Signup from './assets/Components/SignUp/Signup';
import Logout from './assets/Components/Logout/Logout';
import OtpVerify from './assets/Components/SignUp/OtpVerify';
import Profile from './assets/Components/Profile/Profile';
import Cart from './assets/Components/Cart/Cart';
import Checkout from './assets/Components/Checkout/Checkout';
import OrderConfirmation from './assets/Components/Orders/OrderConfirmation';
import RecentOrders from './assets/Components/Orders/RecentOrders';
import Restaurants from './assets/Components/Restaurants/Restaurants';
import RestaurantProducts from './assets/Components/Restaurants/RestaurantProducts';
import OrderProgress from './assets/Components/OrderProgress/OrderProgress';
import ResetPassword from './assets/Components/ResetPassword/ResetPassword';

const AppContent = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();

  // Check user auth state
  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem('user');
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };
    checkUser();
    window.addEventListener('userLogin', checkUser);
    return () => window.removeEventListener('userLogin', checkUser);
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      {user && <Navbar />}
      {user && location.pathname === '/restaurants' && <OrderProgress />}
      <main className="flex-grow-1">
        <Routes>
          {/* Default: always redirect to login unless logged in */}
          <Route path="/" element={user ? <Navigate to="/restaurants" /> : <Navigate to="/login" replace />} />
          {/* Protected routes: only accessible if logged in */}
          <Route path="/products" element={<Products/>} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={user ? <Checkout /> : <Navigate to="/login" replace />} />
          <Route path="/order-confirmation" element={user ? <OrderConfirmation /> : <Navigate to="/login" replace />} />
          <Route path="/recent-orders" element={<RecentOrders />} />
          <Route path="/restaurants" element={user ? <Restaurants /> : <Navigate to="/login" replace />} />
          <Route path="/restaurant/:restaurantId/products" element={user ? <RestaurantProducts /> : <Navigate to="/login" replace />} />
          {/* If already logged in, prevent showing Login/Signup pages */}
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/restaurants" replace />} />
          <Route path="/OtpVerify" element={!user ? <OtpVerify /> : <Navigate to="/restaurants" replace />} />
          <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/restaurants" replace />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </main>
      {user && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
