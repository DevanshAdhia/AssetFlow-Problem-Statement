import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import '../Unauthorized/ErrorPage.css'; // Reusing shared styles

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="error-page-wrapper">
      <div className="error-card">
        <SearchX size={80} className="text-warning mb-4" />
        <h1 className="error-code">404</h1>
        <h2 className="error-title">Page Not Found</h2>
        <p className="error-desc">The page you are looking for doesn't exist or has been moved.</p>
        <button className="btn btn-primary mt-4" onClick={() => navigate('/login')}>
          Go Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
