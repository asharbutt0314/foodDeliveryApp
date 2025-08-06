import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const sendResetOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.success) {
        setMessage('OTP sent to your email');
        setStep(2);
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage('Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword })
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Password reset successful');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage('Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-5 col-md-7">
          <div className="card shadow-lg border-0" style={{ borderRadius: '20px', overflow: 'hidden' }}>
            <div className="card-header text-white text-center py-4" style={{ background: 'linear-gradient(135deg, #FF5722 0%, #FF9800 100%)' }}>
              <h2 className="mb-0">
                <i className="bi bi-key" style={{ fontSize: '1.2em', marginRight: '10px' }}></i>
                Reset Password
              </h2>
            </div>
            
            <div className="card-body p-4" style={{ background: 'linear-gradient(145deg, #ffffff, #f8f9fa)' }}>
              {step === 1 ? (
                <form onSubmit={sendResetOtp}>
                  <div className="mb-4">
                    <label className="form-label fw-bold" style={{ color: '#FF5722' }}><i className="bi bi-envelope"></i> Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
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
                      fontWeight: 'bold'
                    }}
                  >
                    {loading ? <><i className="bi bi-arrow-clockwise"></i> Sending...</> : <><i className="bi bi-envelope"></i> Send OTP</>}
                  </button>
                </form>
              ) : (
                <form onSubmit={resetPassword}>
                  <div className="mb-4">
                    <label className="form-label fw-bold" style={{ color: '#FF5722' }}><i className="bi bi-key"></i> OTP Code</label>
                    <input
                      type="text"
                      className="form-control"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
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
                    <label className="form-label fw-bold" style={{ color: '#FF5722' }}><i className="bi bi-lock"></i> New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
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
                      fontWeight: 'bold'
                    }}
                  >
                    {loading ? <><i className="bi bi-arrow-clockwise"></i> Resetting...</> : <><i className="bi bi-check-circle"></i> Reset Password</>}
                  </button>
                </form>
              )}
              
              {message && (
                <div className="alert alert-info text-center mt-3" style={{ borderRadius: '15px' }}>
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;