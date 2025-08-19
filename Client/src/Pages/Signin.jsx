import React, { useState } from 'react';
import SloganSplash from '../components/SloganSplash';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import jamalBank from '../../image/jamalBank.png';

const Signin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showEmail, setShowEmail] = useState(!localStorage.getItem('user'));
  // Get fingerprintEnabled from user in localStorage if available
  const [fingerprintEnabled, setFingerprintEnabled] = useState(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.fingerprintEnabled || false;
  });
  const navigate = useNavigate();
  const { setUser } = useAppContext();

  const validationSchema = Yup.object({
    password: Yup.string().required('Password is required'),
    ...(showEmail && {
      email: Yup.string().email('Invalid email format').required('Email is required')
    })
  });

  const handleSubmit = async (values) => {
    setIsLoading(true);
    setMessage('');
    try {
      let email = values.email;
      if (!showEmail) {
        const user = JSON.parse(localStorage.getItem('user'));
        email = user?.email;
      }
  const response = await axios.post('https://full-bank-app-x470.onrender.com/api/auth/signin', {
        email,
        password: values.password
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user); // Update context immediately
      setMessage('Login successful! Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  // Fingerprint login logic (WebAuthn placeholder)
  const handleFingerprintLogin = async () => {
    setIsLoading(true);
    setMessage('');
    try {
      // Use WebAuthn if available
      if (window.PublicKeyCredential) {
        // This is a placeholder for real WebAuthn logic
        // In production, you would call navigator.credentials.get with proper options
        setTimeout(() => {
          setIsLoading(false);
          setMessage('Fingerprint login successful! Redirecting to dashboard...');
          navigate('/dashboard');
        }, 1200);
      } else {
        setIsLoading(false);
        setMessage('Fingerprint not supported on this device/browser');
      }
    } catch {
      setIsLoading(false);
      setMessage('Fingerprint login failed');
    }
  };

  if (isLoading) {
    return <SloganSplash />;
  }
  return (
    <div
      className="signin-bg d-flex align-items-center justify-content-center min-vh-100"
      style={{
        background: 'radial-gradient(circle at 20% 30%, #a18cd1 0%, #fbc2eb 100%)',
        animation: 'bgFadeIn 1.2s ease'
      }}
    >
      <style>
        {`
          @keyframes bgFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes cardSlideUp {
            from { transform: translateY(60px) scale(0.95); opacity: 0; }
            to { transform: translateY(0) scale(1); opacity: 1; }
          }
          @keyframes logoPop {
            0% { transform: scale(0.7) rotate(-10deg); opacity: 0; }
            70% { transform: scale(1.1) rotate(5deg); opacity: 1; }
            100% { transform: scale(1) rotate(0deg); }
          }
          .signin-card {
            animation: cardSlideUp 0.9s cubic-bezier(.68,-0.55,.27,1.55);
            border-radius: 2rem;
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.25);
            background: rgba(255,255,255,0.85);
            backdrop-filter: blur(7px);
            border: 1px solid rgba(255,255,255,0.18);
          }
          .signin-logo {
            animation: logoPop 1s cubic-bezier(.68,-0.55,.27,1.55);
            box-shadow: 0 4px 16px 0 rgba(120, 80, 220, 0.15);
            background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%);
            padding: 0.5rem;
            border-radius: 50%;
            margin-bottom: 0.5rem;
          }
          .signin-btn-animated {
            transition: transform 0.15s, box-shadow 0.15s;
          }
          .signin-btn-animated:active {
            transform: scale(0.97);
            box-shadow: 0 2px 8px rgba(120, 80, 220, 0.12);
          }
          .signin-link {
            transition: color 0.2s;
          }
          .signin-link:hover {
            color: #764ba2 !important;
            text-decoration: underline !important;
          }
        `}
      </style>
      <div className="row w-100 justify-content-center">
        <div className="col-12 col-md-7 col-lg-5 col-xl-4">
          <div className="text-center">
            <img
              src={jamalBank}
              alt="Jamal Bank Logo"
              className="signin-logo"
              style={{ width: 90, height: 90, objectFit: 'cover' }}
            />
          </div>
          <div className="signin-card p-4 mt-2">
            <div className="text-center mb-3">
              <h2 className="fw-bold mb-1" style={{ letterSpacing: 1 }}>
                <i className="fas fa-university me-2 text-primary"></i>
                SecureBank
              </h2>
              <p className="text-muted mb-0" style={{ fontSize: '1.1rem' }}>
                Welcome Back! Please sign in.
              </p>
            </div>
            {message && (
              <div
                className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`}
                role="alert"
                style={{ animation: 'bgFadeIn 0.5s' }}
              >
                {message}
              </div>
            )}
            {/* Fingerprint login button if enabled */}
            {fingerprintEnabled && (
              <button
                className="btn btn-outline-success w-100 mb-3 signin-btn-animated"
                onClick={handleFingerprintLogin}
                disabled={isLoading}
                style={{ animation: 'cardSlideUp 0.7s 0.2s backwards' }}
              >
                <i className="fas fa-fingerprint me-2"></i>
                Login with Fingerprint
              </button>
            )}
            <Formik
              initialValues={{
                email: '',
                password: ''
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isValid, dirty }) => (
                <Form>
                  {showEmail && (
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label fw-semibold">Email Address</label>
                      <Field
                        type="email"
                        name="email"
                        className="form-control form-control-lg"
                        placeholder="Enter your email address"
                        autoComplete="username"
                      />
                      <ErrorMessage name="email" component="div" className="text-danger small mt-1" />
                    </div>
                  )}
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label fw-semibold">Password</label>
                    <Field
                      type="password"
                      name="password"
                      className="form-control form-control-lg"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                    />
                    <ErrorMessage name="password" component="div" className="text-danger small mt-1" />
                  </div>
                  <div className="mb-3 form-check">
                    <input type="checkbox" className="form-check-input" id="rememberMe" />
                    <label className="form-check-label" htmlFor="rememberMe">
                      Remember me
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 signin-btn-animated"
                    disabled={!isValid || !dirty || isLoading}
                    style={{ fontWeight: 600, fontSize: '1.1rem', letterSpacing: 0.5 }}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Signing In...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </button>
                  {!showEmail && (
                    <button
                      type="button"
                      className="btn btn-link w-100 mt-2 signin-link"
                      onClick={() => setShowEmail(true)}
                    >
                      <i className="fas fa-user me-2"></i>
                      Sign in with another account
                    </button>
                  )}
                </Form>
              )}
            </Formik>
            <div className="text-center mt-4">
              <small className="text-muted">
                Don't have an account?
                <a href="/signup" className="signin-link ms-1">Sign Up</a>
              </small>
              <br />
              <small className="text-muted">
                <a href="#" className="signin-link">Forgot Password?</a>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;