import React, { useState } from 'react';
import SloganSplash from '../components/SloganSplash';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import jamalBank from '../../image/jamalBank.png';
import { Link } from 'react-router-dom';

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
  const response = await axios.post('https://full-bank-app-1.onrender.com/api/auth/signin', {
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
      className="signup-bg d-flex align-items-center justify-content-center min-vh-100"
      style={{
        background: "radial-gradient(circle at 20% 30%, #a18cd1 0%, #fbc2eb 100%)",
        animation: "bgMove 10s linear infinite alternate"
      }}
    >
      <style>
        {`
          @keyframes bgMove {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
          }
          .signup-card {
            animation: fadeInUp 1s cubic-bezier(.23,1.01,.32,1) both;
            background: rgba(255,255,255,0.95);
            border-radius: 2rem;
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.25);
            backdrop-filter: blur(6px);
            border: 1px solid rgba(255,255,255,0.18);
          }
          @keyframes fadeInUp {
            0% {
              opacity: 0;
              transform: translateY(40px) scale(0.96);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          .logo-bounce {
            animation: bounce 1.2s infinite alternate;
          }
          @keyframes bounce {
            0% { transform: translateY(0);}
            100% { transform: translateY(-12px);}
          }
          .form-floating label {
            color: #7b2ff2;
          }
          .btn-animated {
            transition: background 0.3s, transform 0.2s;
          }
          .btn-animated:active {
            transform: scale(0.97);
            background: linear-gradient(90deg, #7b2ff2 0%, #fbc2eb 100%);
          }
          .signup-link {
            transition: color 0.2s;
          }
          .signup-link:hover {
            color: #764ba2 !important;
            text-decoration: underline !important;
          }
        `}
      </style>
      <div className="signup-card p-4" style={{ width: 380, maxWidth: "95%" }}>
        <div className="text-center mb-4">
          <img
            src={jamalBank}
            alt="Jamal Bank Logo"
            className="logo-bounce"
            style={{
              width: 70,
              borderRadius: "50%",
              boxShadow: "0 4px 16px rgba(123,47,242,0.15)"
            }}
          />
          <h2 className="mt-3 mb-1" style={{ fontWeight: 700, color: "#7b2ff2" }}>
            Jamal Bank
          </h2>
          <div style={{ color: "#764ba2", fontWeight: 500, fontSize: 18 }}>
            Welcome Back! Please sign in.
          </div>
        </div>
        {message && (
          <div
            className={`alert ${message.includes("successful") ? "alert-success" : "alert-danger"} alert-dismissible fade show`}
            role="alert"
            style={{ animation: "fadeInUp 0.6s" }}
          >
            {message}
          </div>
        )}
        {fingerprintEnabled && (
          <button
            className="btn btn-outline-success w-100 mb-3 btn-animated"
            onClick={handleFingerprintLogin}
            disabled={isLoading}
            style={{ animation: 'fadeInUp 0.7s 0.2s backwards' }}
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
                <div className="form-floating mb-3">
                  <Field
                    type="email"
                    name="email"
                    className="form-control"
                    id="email"
                    placeholder="Email Address"
                    autoComplete="username"
                  />
                  <label htmlFor="email">Email Address</label>
                  <ErrorMessage name="email" component="div" className="text-danger small mt-1" />
                </div>
              )}
              <div className="form-floating mb-3">
                <Field
                  type="password"
                  name="password"
                  className="form-control"
                  id="password"
                  placeholder="Password"
                  autoComplete="current-password"
                />
                <label htmlFor="password">Password</label>
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
                className="btn btn-animated btn-gradient w-100 py-2 mb-2"
                style={{
                  background: "linear-gradient(90deg, #7b2ff2 0%, #fbc2eb 100%)",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 18,
                  letterSpacing: 1
                }}
                disabled={!isValid || !dirty || isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
              {!showEmail && (
                <button
                  type="button"
                  className="btn btn-link w-100 mt-2 signup-link"
                  onClick={() => setShowEmail(true)}
                >
                  <i className="fas fa-user me-2"></i>
                  Sign in with another account
                </button>
              )}
            </Form>
          )}
        </Formik>
        <div className="text-center mt-3">
          <small className="text-muted">
            Don't have an account?
            <Link
              to="/signup"
              className="text-decoration-none ms-1"
              style={{
                color: "#7b2ff2",
                fontWeight: 600,
                transition: "color 0.2s"
              }}
              onMouseOver={e => (e.target.style.color = "#764ba2")}
              onMouseOut={e => (e.target.style.color = "#7b2ff2")}
            >
              Sign Up
            </Link>
          </small>
          <br />
          <small className="text-muted">
            <Link to="#" className="signup-link">Forgot Password?</Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Signin;