import React, { useState, useEffect } from 'react';

const OrderProgress = () => {
  const [orderCount, setOrderCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const TARGET_ORDERS = 35;
  const progressPercentage = Math.min((orderCount / TARGET_ORDERS) * 100, 100);

  useEffect(() => {
    const fetchOrderCount = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) return;

        const res = await fetch(`http://localhost:5000/orders/client/${user._id}/count`);
        if (res.ok) {
          const data = await res.json();
          setOrderCount(data.count || 0);
        }
      } catch (err) {
        console.error('Failed to fetch order count:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderCount();
  }, []);

  if (loading) return null;

  return (
    <div className="container mt-3 mb-4">
      <div className="card border-0 shadow-sm" style={{ borderRadius: '15px', background: 'linear-gradient(135deg, #FF5722 0%, #FF9800 100%)' }}>
        <div className="card-body p-4 text-white">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h5 className="mb-2">
                <i className="bi bi-bar-chart" style={{ fontSize: '1.2em', marginRight: '10px' }}></i>
                Restaurant Performance
              </h5>
              <p className="mb-3" style={{ opacity: '0.9' }}>
                {orderCount} / {TARGET_ORDERS} orders received this month
              </p>
              <div className="progress" style={{ height: '12px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.3)' }}>
                <div
                  className="progress-bar"
                  style={{
                    width: `${progressPercentage}%`,
                    background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                    borderRadius: '10px',
                    transition: 'width 0.5s ease'
                  }}
                ></div>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <div style={{ fontSize: '3rem' }}>
                {orderCount >= 35 ? <i className="bi bi-trophy"></i> : orderCount >= 30 ? <i className="bi bi-star"></i> : orderCount >= 20 ? <i className="bi bi-hand-thumbs-up"></i> : <i className="bi bi-rocket"></i>}
              </div>
              <p className="mb-0 small" style={{ opacity: '0.9' }}>
                {orderCount >= 35 ? 'Outstanding Performance!' : orderCount >= 30 ? 'Excellent!' : orderCount >= 20 ? 'Great Job!' : 'Keep Growing!'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderProgress;