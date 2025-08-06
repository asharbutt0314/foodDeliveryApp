import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useToast } from '../Toast/ToastProvider';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/products");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

      try {
        const res = await axios.post("http://localhost:5000/Clientauth/login", {
          email,
          password,
        });

        if (res.data.success) {
          // Save user & trigger login event
          if (res.data.client) {
            localStorage.setItem("user", JSON.stringify(res.data.client));
            localStorage.setItem("token", res.data.token);
            window.dispatchEvent(new Event("userLogin"));

            // alert("Login successful");
            // toast.addToast("Login successful!", "success");
            navigate("/products");
          } else {
            localStorage.removeItem("user");
          }
        } else {
          setMessage(res.data.message || "Login failed");
          toast.addToast(res.data.message || "Login failed", "error");
        }
      } catch (err) {
        console.error(err);
        const errorMessage = err.response?.data?.message || "Something went wrong";
        setMessage(errorMessage);
        toast.addToast(errorMessage, "error");

        if (err.response?.status === 403 && errorMessage.includes("not verified")) {
          // Automatically send OTP before redirecting to OTP verification page
          try {
            await axios.post('http://localhost:5000/Clientauth/resend-otp', { email });
            const autoMessage = "OTP sent automatically. Please check your email to verify your account.";
            navigate('/OtpVerify', { state: { email, message: autoMessage } });
          } catch (sendErr) {
            // If resend OTP fails, still redirect but show error message
            const failMessage = "client not verified. Failed to send OTP automatically. Please try resending manually.";
            navigate('/OtpVerify', { state: { email, message: failMessage } });
          }
        }
      }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-5 col-md-7">
          <div className="card shadow-lg border-0" style={{ borderRadius: '20px', overflow: 'hidden' }}>
            <div className="card-header text-white text-center py-4" style={{ background: 'linear-gradient(135deg, #FF5722 0%, #FF9800 100%)' }}>
              <h2 className="mb-0">
                <i className="bi bi-shop" style={{ fontSize: '1.2em', marginRight: '10px' }}></i>
                Admin Login
              </h2>
              <p className="mb-0 mt-2" style={{ opacity: '0.9' }}>Access your restaurant dashboard</p>
            </div>
            
            <div className="card-body p-4" style={{ background: 'linear-gradient(145deg, #ffffff, #f8f9fa)' }}>
              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <label className="form-label fw-bold" style={{ color: '#FF5722' }}><i className="bi bi-envelope"></i> Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ 
                      borderRadius: '15px', 
                      border: '2px solid #FFE0B2', 
                      padding: '12px 20px',
                      fontSize: '16px'
                    }}
                    placeholder="Enter your admin email"
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold" style={{ color: '#FF5722' }}><i className="bi bi-lock"></i> Password</label>
                  <input
                    type="password"
                    className="form-control"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ 
                      borderRadius: '15px', 
                      border: '2px solid #FFE0B2', 
                      padding: '12px 20px',
                      fontSize: '16px'
                    }}
                    placeholder="Enter your password"
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-lg w-100 mb-3"
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
                  <i className="bi bi-box-arrow-in-right"></i> Access Dashboard
                </button>

                {message && (
                  <div className="alert alert-warning text-center" style={{ borderRadius: '15px', border: '2px solid #FF9800' }}>
                    {message}
                  </div>
                )}
                
                <div className="text-center mt-3">
                  <p className="text-muted mt-2">Forgot your password? <a href="/reset-password" style={{ color: '#FF5722', textDecoration: 'none', fontWeight: 'bold' }}>Reset here</a></p>
                  <p className="text-muted">New restaurant owner? <a href="/signup" style={{ color: '#FF5722', textDecoration: 'none', fontWeight: 'bold' }}>Register here</a></p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
