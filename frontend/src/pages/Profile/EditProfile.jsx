import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, ArrowLeft } from 'lucide-react';
import { currentUser } from '../../data/mockData';
import './Profile.css';

const EditProfile = () => {
  const navigate = useNavigate();
  const [profileImg, setProfileImg] = useState(currentUser.avatar);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a temporary URL for the uploaded image to preview it
      const imageUrl = URL.createObjectURL(file);
      setProfileImg(imageUrl);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Normally you'd send data to the backend here
    navigate('/profile');
  };

  return (
    <div className="profile-page">
      <div className="page-header flex-between">
        <div>
          <h1>Edit Profile</h1>
          <p className="text-muted">Update your personal details and profile picture.</p>
        </div>
        <button className="btn btn-outline btn-sm" onClick={() => navigate('/profile')}>
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      <div className="profile-card">
        <form onSubmit={handleSave} className="profile-content mt-0">
          
          <div className="image-upload-section">
            <div className="avatar-preview-container">
              <img src={profileImg} alt="Profile Preview" className="profile-avatar-large" />
              <label htmlFor="avatar-upload" className="upload-overlay">
                <Camera size={24} color="white" />
              </label>
              <input 
                type="file" 
                id="avatar-upload" 
                accept="image/*" 
                onChange={handleImageChange} 
                style={{ display: 'none' }}
              />
            </div>
            <div className="upload-text">
              <h4>Profile Picture</h4>
              <p className="text-muted">PNG, JPG up to 5MB</p>
            </div>
          </div>

          <hr className="divider" />

          <div className="form-row">
            <div className="form-group half-width">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-control" defaultValue={currentUser.name} required />
            </div>
            
            <div className="form-group half-width">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-control" defaultValue={currentUser.email} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group half-width">
              <label className="form-label">Phone Number</label>
              <input type="tel" className="form-control" defaultValue={currentUser.phone} />
            </div>
            
            <div className="form-group half-width">
              <label className="form-label">Department</label>
              <select className="form-control" defaultValue={currentUser.department}>
                <option value="IT Infrastructure">IT Infrastructure</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Operations">Operations</option>
                <option value="Finance">Finance</option>
              </select>
            </div>
          </div>

          <div className="profile-actions mt-2">
            <button type="submit" className="btn btn-primary">Save Changes</button>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/profile')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
