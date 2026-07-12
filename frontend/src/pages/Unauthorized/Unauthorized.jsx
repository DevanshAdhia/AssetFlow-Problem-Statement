import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import './ErrorPage.css'; // Shared error page styles

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="error-page-wrapper">
      <div className="error-card">
        <ShieldAlert size={80} className="text-danger mb-4" />
        <h1 className="error-code">403</h1>
        <h2 className="error-title">Access Denied</h2>
        <p className="error-desc">You don't have permission to access this page.</p>
        <button className="btn btn-primary mt-4" onClick={() => navigate('/dashboard')}>
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
