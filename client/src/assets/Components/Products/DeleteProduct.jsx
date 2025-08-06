import React from 'react';
import { useToast } from '../Toast/ToastProvider';
// import 'Product.css';
const DeleteProduct = ({ productId, onDeleteSuccess, buttonClassName, buttonStyle }) => {
  const toast = useToast();

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await fetch(`http://localhost:5000/products/deleteproduct/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clientId: user._id })
      });
      if (response.ok) {
        toast.addToast('Product deleted successfully', 'success');
        if (onDeleteSuccess) {
          onDeleteSuccess(productId);
        }
      } else {
        const errorData = await response.json();
        toast.addToast(errorData.message || 'Failed to delete product', 'error');
      }
    } catch (error) {
      toast.addToast('Error deleting product: ' + error.message, 'error');
    }
  };

  return (
   <button
  className={buttonClassName || "btn ms-2"}
  onClick={handleDelete}
  style={buttonStyle || {
    marginTop: '1rem',
    backgroundColor: 'transparent',
    color: '#dc3545',
    border: '2px solid #dc3545',
    borderRadius: '50px',
    padding: '0.5rem 1.5rem',
    fontWeight: 500,
    fontSize: '1rem',
    lineHeight: 1.5,
    transition: 'background-color 0.3s ease, color 0.3s ease, transform 0.2s ease',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  }}
  onMouseOver={(e) => {
    if (!buttonStyle) {
      e.target.style.backgroundColor = '#dc3545';
      e.target.style.color = '#fff';
      e.target.style.transform = 'translateY(-1px)';
    } else {
      e.target.style.background = '#e0e0e0';
      e.target.style.transform = 'scale(1.1)';
    }
  }}
  onMouseOut={(e) => {
    if (!buttonStyle) {
      e.target.style.backgroundColor = 'transparent';
      e.target.style.color = '#dc3545';
      e.target.style.transform = 'none';
    } else {
      e.target.style.background = 'transparent';
      e.target.style.transform = 'scale(1)';
    }
  }}
>
  <i className="bi bi-trash"></i>
</button>

  );
};

export default DeleteProduct;
