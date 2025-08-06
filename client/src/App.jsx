// 📍 Path: App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './assets/Components/Navbar/Navbar';
import Footer from './assets/Components/Footer/Footer';
import './App.css';
import Products from './assets/Components/Products/Products';
import AddProduct from './assets/Components/Products/AddProduct';
import EditProduct from './assets/Components/Products/EditProduct';
import Contact from './assets/Components/Contact/Contact';
import Login from './assets/Components/Login/Login';
import Signup from './assets/Components/SignUp/Signup';
import Logout from './assets/Components/Logout/Logout';
import OtpVerify from './assets/Components/SignUp/OtpVerify';
import DeleteProduct from './assets/Components/Products/DeleteProduct';
import Profile from './assets/Components/Profile/Profile';
import Orders from './assets/Components/Orders/Orders';
import OrderDetails from './assets/Components/Orders/OrderDetails';
import OrderProgress from './assets/Components/OrderProgress/OrderProgress';
import ResetPassword from './assets/Components/ResetPassword/ResetPassword';

const AppContent = () => {
  const [client, setClient] = useState(null);
  const location = useLocation();

  // Check user auth state
  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser && storedUser !== "undefined") {
        setClient(JSON.parse(storedUser));
      } else {
        setClient(null);
      }
    };
    checkUser();
    window.addEventListener('userLogin', checkUser);
    return () => window.removeEventListener('userLogin', checkUser);
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      {client && <Navbar />}
      {client && location.pathname === '/products' && <OrderProgress />}
      <main className="flex-grow-1">
        <Routes>
          {/* Default: always redirect to login unless logged in */}
          <Route path="/" element={client ? <Navigate to="/products" /> : <Navigate to="/login" replace />} />
          {/* Protected routes: only accessible if logged in */}
          <Route path="/products" element={client ? <Products/> : <Navigate to="/login" replace />} />
          <Route path="/deleteproduct/:id" element={client ? <DeleteProduct/> : <Navigate to="/login" replace />} />
          <Route path="/addproduct" element={client ? <AddProduct /> : <Navigate to="/login" replace />} />
          <Route path="/editproduct/:id" element={client ? <EditProduct /> : <Navigate to="/login" replace />} />
          {/* <Route path="/offers" element={client ? <Offers /> : <Navigate to="/login" replace />} /> */}
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={client ? <Orders /> : <Navigate to="/login" replace />} />
          <Route path="/order-details/:orderId" element={client ? <OrderDetails /> : <Navigate to="/login" replace />} />
          {/* <Route path="/cart" element={client ? <Cart /> : <Navigate to="/login" replace />} /> */}
          {/* If already logged in, prevent showing Login/Signup pages */}
          <Route path="/login" element={!client ? <Login /> : <Navigate to="/products" replace />} />
          <Route path="/OtpVerify" element={!client ? <OtpVerify /> : <Navigate to="/products" replace />} />
          <Route path="/signup" element={!client ? <Signup /> : <Navigate to="/products" replace />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </main>
      {client && <Footer />}
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
