import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AccountManagement = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  
  const [accountFormData, setAccountFormData] = useState({
    name: '',
    email: ''
  });
  
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  
  const [accountError, setAccountError] = useState('');
  const [accountSuccess, setAccountSuccess] = useState('');
  const [accountLoading, setAccountLoading] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    if (user) {
      setAccountFormData({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccountFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (accountError) setAccountError('');
    if (accountSuccess) setAccountSuccess('');
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (passwordError) setPasswordError('');
    if (passwordSuccess) setPasswordSuccess('');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleOpenAccountModal = () => {
    if (user) {
      setAccountFormData({
        name: user.name || '',
        email: user.email || ''
      });
    }
    setAccountError('');
    setAccountSuccess('');
    setShowAccountModal(true);
  };

  const handleCloseAccountModal = () => {
    setShowAccountModal(false);
    setAccountError('');
    setAccountSuccess('');
    if (user) {
      setAccountFormData({
        name: user.name || '',
        email: user.email || ''
      });
    }
  };

  const handleOpenPasswordModal = () => {
    setPasswordFormData({
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });
    setPasswordError('');
    setPasswordSuccess('');
    setShowPasswordModal(true);
  };

  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordError('');
    setPasswordSuccess('');
    setPasswordFormData({
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });
  };

  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    setAccountError('');
    setAccountSuccess('');
    setAccountLoading(true);

    if (!accountFormData.name || !accountFormData.email) {
      setAccountError('Name and email are required.');
      setAccountLoading(false);
      return;
    }

    if (accountFormData.name.trim().length < 2) {
      setAccountError('Name must be at least 2 characters long.');
      setAccountLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(accountFormData.email)) {
      setAccountError('Please enter a valid email address.');
      setAccountLoading(false);
      return;
    }

    if (accountFormData.email.trim() !== user.email) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const emailExists = users.find(u => u.email === accountFormData.email.trim() && u.id !== user.id);
      if (emailExists) {
        setAccountError('This email is already registered. Please use a different email.');
        setAccountLoading(false);
        return;
      }
    }

    try {
      const updateData = {
        name: accountFormData.name.trim(),
        email: accountFormData.email.trim()
      };

      const result = await updateUser(updateData);

      if (result.success) {
        setAccountSuccess(result.message);
        setTimeout(() => {
          setShowAccountModal(false);
          setAccountSuccess('');
        }, 1500);
      } else {
        setAccountError(result.message);
      }
    } catch (err) {
      setAccountError('An unexpected error occurred. Please try again.');
      console.error('Update error:', err);
    } finally {
      setAccountLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    setPasswordLoading(true);

    if (!passwordFormData.currentPassword) {
      setPasswordError('Please enter your current password.');
      setPasswordLoading(false);
      return;
    }

    if (!passwordFormData.newPassword) {
      setPasswordError('Please enter a new password.');
      setPasswordLoading(false);
      return;
    }

    if (passwordFormData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      setPasswordLoading(false);
      return;
    }

    if (passwordFormData.newPassword !== passwordFormData.confirmNewPassword) {
      setPasswordError('New passwords do not match.');
      setPasswordLoading(false);
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const currentUser = users.find(u => u.id === user.id);
    if (currentUser && currentUser.password !== passwordFormData.currentPassword) {
      setPasswordError('Current password is incorrect.');
      setPasswordLoading(false);
      return;
    }

    try {
      const updateData = {
        name: user.name,
        email: user.email,
        password: passwordFormData.newPassword
      };

      const result = await updateUser(updateData);

      if (result.success) {
        setPasswordSuccess('Password changed successfully!');
        setPasswordFormData({
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        });
        setTimeout(() => {
          setShowPasswordModal(false);
          setPasswordSuccess('');
        }, 1500);
      } else {
        setPasswordError(result.message);
      }
    } catch (err) {
      setPasswordError('An unexpected error occurred. Please try again.');
      console.error('Password update error:', err);
    } finally {
      setPasswordLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'N/A';
    }
  };

  return (
    <>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card card-custom">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 className="card-title mb-0">Account Management</h2>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>

                {/* Account information display (read-only) */}
                <div className="mb-3">
                  <label className="form-label text-muted">Member Since</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formatDate(user?.createdAt)}
                    disabled
                    readOnly
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={user?.name || ''}
                    disabled
                    readOnly
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    value={user?.email || ''}
                    disabled
                    readOnly
                  />
                </div>

                {/* Action buttons */}
                <div className="mt-4 d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleOpenAccountModal}
                  >
                    Edit Account
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleOpenPasswordModal}
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Account Modal */}
      {showAccountModal && (
        <div 
          className="modal fade show" 
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Account Information</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseAccountModal}
                  disabled={accountLoading}
                  aria-label="Close"
                ></button>
              </div>
              
              <form onSubmit={handleAccountSubmit}>
                <div className="modal-body">
                  {/* Error message display */}
                  {accountError && (
                    <div className="alert alert-danger" role="alert">
                      {accountError}
                    </div>
                  )}

                  {/* Success message display */}
                  {accountSuccess && (
                    <div className="alert alert-success" role="alert">
                      {accountSuccess}
                    </div>
                  )}

                  {/* Name field */}
                  <div className="mb-3">
                    <label htmlFor="modal-name" className="form-label">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="modal-name"
                      name="name"
                      value={accountFormData.name}
                      onChange={handleAccountChange}
                      placeholder="Enter your full name"
                      required
                      disabled={accountLoading}
                    />
                  </div>

                  {/* Email field */}
                  <div className="mb-3">
                    <label htmlFor="modal-email" className="form-label">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="modal-email"
                      name="email"
                      value={accountFormData.email}
                      onChange={handleAccountChange}
                      placeholder="Enter your email"
                      required
                      disabled={accountLoading}
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseAccountModal}
                    disabled={accountLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={accountLoading}
                  >
                    {accountLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div 
          className="modal fade show" 
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Change Password</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleClosePasswordModal}
                  disabled={passwordLoading}
                  aria-label="Close"
                ></button>
              </div>
              
              <form onSubmit={handlePasswordSubmit}>
                <div className="modal-body">
                  {/* Error message display */}
                  {passwordError && (
                    <div className="alert alert-danger" role="alert">
                      {passwordError}
                    </div>
                  )}

                  {/* Success message display */}
                  {passwordSuccess && (
                    <div className="alert alert-success" role="alert">
                      {passwordSuccess}
                    </div>
                  )}

                  <div className="mb-3">
                    <label htmlFor="password-currentPassword" className="form-label">
                      Current Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password-currentPassword"
                      name="currentPassword"
                      value={passwordFormData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter current password"
                      required
                      disabled={passwordLoading}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password-newPassword" className="form-label">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password-newPassword"
                      name="newPassword"
                      value={passwordFormData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter new password (min. 6 characters)"
                      required
                      disabled={passwordLoading}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password-confirmPassword" className="form-label">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password-confirmPassword"
                      name="confirmNewPassword"
                      value={passwordFormData.confirmNewPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm new password"
                      required
                      disabled={passwordLoading}
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleClosePasswordModal}
                    disabled={passwordLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={passwordLoading}
                  >
                    {passwordLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Changing...
                      </>
                    ) : (
                      'Change Password'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AccountManagement;
