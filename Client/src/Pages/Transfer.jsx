import React, { useState } from 'react';
import SloganSplash from '../components/SloganSplash';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Transfer = () => {
  const [recentRecipients, setRecentRecipients] = useState([]);
  const { user, setUser, isDarkMode } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const navigate = useNavigate();

  const transferValidationSchema = Yup.object({
    recipientAccountNumber: Yup.string()
      .required('Recipient account number is required')
      .matches(/^\d{10}$/, 'Account number must be 10 digits'),
    amount: Yup.number()
      .positive('Amount must be positive')
      .required('Amount is required')
      .min(1, 'Minimum transfer amount is ₦1')
      .max(user?.accountBalance || 0, 'Amount exceeds available balance'),
    description: Yup.string()
      .required('Description is required')
      .max(100, 'Description must be less than 100 characters')
  });

  const handleTransfer = async (values, { resetForm }) => {
    setIsLoading(true);
    setMessage('');
    
    try {
      const token = localStorage.getItem('token');
  const response = await axios.post('https://full-bank-app-1.onrender.com/api/banking/transfer', {
        recipientAccountNumber: values.recipientAccountNumber,
        amount: parseFloat(values.amount),
        description: values.description
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage('Transfer completed successfully!');
      
      // Update user balance
      const updatedUser = { ...user, accountBalance: response.data.newBalance };
      setUser(updatedUser);
      
      resetForm();
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (error) {
      setMessage(error.response?.data?.message || 'Transfer failed');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  // Fetch profile image on mount
  React.useEffect(() => {
    setProfileImage(user?.profileImage || '');
  }, [user]);

  if (isLoading) {
    return <SloganSplash />;
  }

  return (
    <div className={`min-vh-100 ${isDarkMode ? 'bg-gradient-dark' : 'bg-gradient-light'} position-relative`}>
      {/* Animated Background Circles */}
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{ zIndex: 0, pointerEvents: 'none' }}>
        <div className="bg-circle bg-primary" style={{
          position: 'absolute', width: 300, height: 300, borderRadius: '50%',
          top: -100, left: -100, opacity: 0.15, animation: 'float1 8s ease-in-out infinite'
        }} />
        <div className="bg-circle bg-success" style={{
          position: 'absolute', width: 200, height: 200, borderRadius: '50%',
          bottom: 50, right: -80, opacity: 0.12, animation: 'float2 10s ease-in-out infinite'
        }} />
        <style>
          {`
            @keyframes float1 {
              0%, 100% { transform: translateY(0);}
              50% { transform: translateY(30px);}
            }
            @keyframes float2 {
              0%, 100% { transform: translateY(0);}
              50% { transform: translateY(-40px);}
            }
          `}
        </style>
      </div>

      {/* Header with fade-in */}
      <div className={`border-bottom sticky-top ${isDarkMode ? 'bg-dark border-secondary' : 'bg-white border-light'} animate__animated animate__fadeInDown`} style={{ zIndex: 2 }}>
        <div className="container py-3">
          <div className="d-flex align-items-center">
            <button 
              className={`btn ${isDarkMode ? 'btn-outline-light' : 'btn-outline-dark'} me-3`}
              onClick={() => navigate('/dashboard')}
            >
              <i className="fas fa-arrow-left"></i>
            </button>
            <h4 className={`mb-0 fw-bold ${isDarkMode ? 'text-light' : 'text-dark'}`}>Transfer Money</h4>
          </div>
        </div>
      </div>

      <div className="container py-4 position-relative" style={{ zIndex: 2 }}>
        {/* Animated Alert */}
        {message && (
          <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'} alert-dismissible fade show animate__animated animate__fadeInDown`} role="alert">
            {message}
            <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
          </div>
        )}

        {/* Profile Card with bounce-in */}
        <div className="row mb-4 justify-content-center">
          <div className="col-md-6">
            <div className={`card shadow-lg border-0 animate__animated animate__bounceInDown ${isDarkMode ? 'bg-dark text-light' : 'bg-white'}`}
              style={{ borderRadius: '2rem', position: 'relative', overflow: 'hidden' }}>
              <div className="card-body text-center">
                <div style={{ position: 'relative', display: 'inline-block', animation: 'pulseAvatar 2s infinite alternate' }}>
                  <img
                    src={profileImage || '/public/vite.svg'}
                    alt="avatar"
                    className="rounded-circle border"
                    style={{ width: 90, height: 90, objectFit: 'cover', border: '4px solid #00C853', boxShadow: '0 0 0 6px rgba(0,200,83,0.1)' }}
                  />
                  <span
                    style={{ position: 'absolute', right: 0, bottom: 0, background: '#00C853', borderRadius: '50%', padding: 7, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                    onClick={() => setShowModal(true)}
                  >
                    <i className="fas fa-camera text-white"></i>
                  </span>
                </div>
                <h5 className="mt-3 mb-0 fw-bold">{user?.firstName} {user?.lastName}</h5>
                <small className="text-muted">{user?.accountNumber}</small>
              </div>
            </div>
          </div>
        </div>
        <style>
          {`
            @keyframes pulseAvatar {
              0% { transform: scale(1);}
              100% { transform: scale(1.05);}
            }
          `}
        </style>

        {/* Modal for image upload */}
        {showModal && (
          <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content animate__animated animate__zoomIn">
                <div className="modal-header">
                  <h5 className="modal-title">Update Profile Image</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <input type="file" accept="image/*" onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onloadend = async () => {
                      const base64 = reader.result;
                      setProfileImage(base64);
                      // Send to backend
                      const token = localStorage.getItem('token');
                      try {
                        const res = await axios.put('https://full-bank-app-1.onrender.com/api/auth/profile-image', { image: base64 }, {
                          headers: { Authorization: `Bearer ${token}` }
                        });
                        setUser({ ...user, profileImage: res.data.profileImage });
                        setMessage('Profile image updated!');
                        setShowModal(false);
                      } catch {
                        setMessage('Failed to update image');
                      }
                    };
                    reader.readAsDataURL(file);
                  }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Balance Card with slide-in */}
        <div className="row mb-4">
          <div className="col-12">
            <div className={`card shadow border-0 animate__animated animate__slideInLeft ${isDarkMode ? 'bg-gradient-success text-light' : 'bg-gradient-primary text-white'}`} style={{ borderRadius: '2rem' }}>
              <div className="card-body text-center">
                <h6 className="card-subtitle mb-2 opacity-75">Available Balance</h6>
                <h2 className="card-title mb-0 fw-bold" style={{ letterSpacing: 1 }}>{formatCurrency(user?.accountBalance || 0)}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions with fade-in */}
        <div className="row mb-4 justify-content-center">
          <div className="col-md-8">
            <div className="d-flex justify-content-between gap-2 animate__animated animate__fadeInUp">
              <button className="btn btn-success rounded-pill px-4 py-2 shadow-sm" onClick={() => navigate('/fund-account')}>
                <i className="fas fa-plus me-2"></i>Fund
              </button>
              <button className="btn btn-outline-success rounded-pill px-4 py-2 shadow-sm" onClick={() => navigate('/withdraw')}>
                <i className="fas fa-arrow-down me-2"></i>Withdraw
              </button>
              <button className="btn btn-outline-success rounded-pill px-4 py-2 shadow-sm" onClick={() => navigate('/savings')}>
                <i className="fas fa-piggy-bank me-2"></i>Savings
              </button>
            </div>
          </div>
        </div>

        {/* Recent Recipients with fade-in */}
        <div className="row mb-4 justify-content-center">
          <div className="col-md-8">
            <div className={`card shadow border-0 animate__animated animate__fadeIn ${isDarkMode ? 'bg-dark text-light' : 'bg-white'}`} style={{ borderRadius: '2rem' }}>
              <div className="card-body">
                <h6 className="mb-3 fw-bold">Recent Recipients</h6>
                <div className="d-flex flex-wrap gap-2">
                  {recentRecipients.length === 0 ? (
                    <span className="text-muted">No recent recipients</span>
                  ) : (
                    recentRecipients.map((r, idx) => (
                      <button key={idx} className="btn btn-outline-success rounded-pill animate__animated animate__pulse" style={{ minWidth: 120 }}
                        onClick={() => navigate(`/transfer?recipient=${r.accountNumber}`)}>
                        <i className="fas fa-user me-2"></i>{r.name || r.accountNumber}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transfer Form with fade-in */}
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className={`card border-0 shadow-lg animate__animated animate__fadeInUp ${isDarkMode ? 'bg-dark text-light' : 'bg-white'}`} style={{ borderRadius: '2rem' }}>
              <div className="card-body">
                <Formik
                  initialValues={{
                    recipientAccountNumber: '',
                    amount: '',
                    description: ''
                  }}
                  validationSchema={transferValidationSchema}
                  onSubmit={handleTransfer}
                >
                  {({ isValid, dirty }) => (
                    <Form>
                      <div className="mb-3">
                        <label htmlFor="recipientAccountNumber" className="form-label fw-bold">
                          <i className="fas fa-user me-2"></i>
                          Recipient Account Number
                        </label>
                        <Field
                          type="text"
                          name="recipientAccountNumber"
                          className={`form-control ${isDarkMode ? 'bg-dark text-light border-secondary' : ''} animate__animated animate__fadeInLeft`}
                          placeholder="Enter 10-digit account number"
                          maxLength="10"
                        />
                        <ErrorMessage name="recipientAccountNumber" component="div" className="text-danger small mt-1" />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="amount" className="form-label fw-bold">
                          <i className="fas fa-naira-sign me-2"></i>
                          Amount
                        </label>
                        <Field
                          type="number"
                          name="amount"
                          className={`form-control ${isDarkMode ? 'bg-dark text-light border-secondary' : ''} animate__animated animate__fadeInLeft`}
                          placeholder="Enter amount"
                          min="1"
                          max={user?.accountBalance || 0}
                        />
                        <ErrorMessage name="amount" component="div" className="text-danger small mt-1" />
                        <small className={`${isDarkMode ? 'text-light' : 'text-muted'}`}>
                          Available: {formatCurrency(user?.accountBalance || 0)}
                        </small>
                      </div>

                      <div className="mb-4">
                        <label htmlFor="description" className="form-label fw-bold">
                          <i className="fas fa-comment me-2"></i>
                          Description
                        </label>
                        <Field
                          type="text"
                          name="description"
                          className={`form-control ${isDarkMode ? 'bg-dark text-light border-secondary' : ''} animate__animated animate__fadeInLeft`}
                          placeholder="What's this transfer for?"
                          maxLength="100"
                        />
                        <ErrorMessage name="description" component="div" className="text-danger small mt-1" />
                      </div>

                      <button
                        type="submit"
                        className="btn btn-success w-100 py-3 rounded-pill fw-bold shadow animate__animated animate__pulse"
                        disabled={!isValid || !dirty || isLoading}
                        style={{ fontSize: 18, letterSpacing: 1 }}
                      >
                        {isLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Processing Transfer...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-paper-plane me-2"></i>
                            Send Money
                          </>
                        )}
                      </button>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History with fade-in */}
        <div className="row mt-5 justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className={`card shadow border-0 animate__animated animate__fadeInUp ${isDarkMode ? 'bg-dark text-light' : 'bg-white'}`} style={{ borderRadius: '2rem' }}>
              <div className="card-body">
                <h6 className="mb-3 fw-bold">Transaction History</h6>
                <div style={{ maxHeight: 220, overflowY: 'auto' }}>
                  {(user?.transactions || []).slice(0, 10).map((tx, idx) => (
                    <div key={idx} className="d-flex justify-content-between align-items-center mb-2 animate__animated animate__fadeInLeft" style={{ animationDelay: `${idx * 0.1}s` }}>
                      <div>
                        <span className={`badge ${tx.type === 'debit' ? 'bg-danger' : 'bg-success'} me-2`}>
                          {tx.type === 'debit' ? 'Sent' : 'Received'}
                        </span>
                        <span>{tx.description}</span>
                      </div>
                      <div>
                        <span className="fw-bold">{formatCurrency(tx.amount)}</span>
                        <span className="ms-2 text-muted" style={{ fontSize: 12 }}>{new Date(tx.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                  {(!user?.transactions || user.transactions.length === 0) && (
                    <span className="text-muted">No transactions yet</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Animate.css CDN for animations */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"/>
    </div>
  );
}

export default Transfer;
