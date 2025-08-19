import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jamalBank from '../../image/jamalBank.png';

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .min(2, 'First name must be at least 2 characters')
      .required('First name is required'),
    lastName: Yup.string()
      .min(2, 'Last name must be at least 2 characters')
      .required('Last name is required'),
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required')
  });

  const handleSubmit = async (values) => {
    setIsLoading(true);
    setMessage('');
    
    try {
      console.log('Attempting to signup with:', { firstName: values.firstName, lastName: values.lastName, email: values.email });
      
  const response = await axios.post('https://full-bank-app-x470.onrender.com/api/auth/signup', {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password
      });

      console.log('Signup successful:', response.data);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      setMessage('Account created successfully! Please sign in with your credentials.');
      setTimeout(() => {
        navigate('/signin');
      }, 2000);
      
    } catch (error) {
      console.error('Signup error:', error);
      console.error('Error response:', error.response);
      
      if (error.response) {
        // Server responded with error
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        setMessage(error.response.data?.message || `Server error: ${error.response.status}`);
      } else if (error.request) {
        // Request was made but no response received
        console.error('No response received:', error.request);
        setMessage('Cannot connect to server. Please check your internet connection.');
      } else {
        // Something else happened
        console.error('Error setting up request:', error.message);
        setMessage('An unexpected error occurred: ' + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

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
            JamalSecureBank
          </h2>
          <div style={{ color: "#764ba2", fontWeight: 500, fontSize: 18 }}>
            Create Your Account
          </div>
        </div>
        {message && (
          <div
            className={`alert ${message.includes("successfully") ? "alert-success" : "alert-danger"} alert-dismissible fade show`}
            role="alert"
            style={{ animation: "fadeInUp 0.6s" }}
          >
            {message}
          </div>
        )}
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: ""
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isValid, dirty }) => (
            <Form>
              <div className="row g-3 mb-2">
                <div className="col-6">
                  <div className="form-floating">
                    <Field
                      type="text"
                      name="firstName"
                      className="form-control"
                      id="firstName"
                      placeholder="First Name"
                    />
                    <label htmlFor="firstName">First Name</label>
                  </div>
                  <ErrorMessage name="firstName" component="div" className="text-danger small mt-1" />
                </div>
                <div className="col-6">
                  <div className="form-floating">
                    <Field
                      type="text"
                      name="lastName"
                      className="form-control"
                      id="lastName"
                      placeholder="Last Name"
                    />
                    <label htmlFor="lastName">Last Name</label>
                  </div>
                  <ErrorMessage name="lastName" component="div" className="text-danger small mt-1" />
                </div>
              </div>
              <div className="form-floating mb-2">
                <Field
                  type="email"
                  name="email"
                  className="form-control"
                  id="email"
                  placeholder="Email Address"
                />
                <label htmlFor="email">Email Address</label>
                <ErrorMessage name="email" component="div" className="text-danger small mt-1" />
              </div>
              <div className="form-floating mb-2">
                <Field
                  type="password"
                  name="password"
                  className="form-control"
                  id="password"
                  placeholder="Password"
                />
                <label htmlFor="password">Password</label>
                <ErrorMessage name="password" component="div" className="text-danger small mt-1" />
              </div>
              <div className="form-floating mb-3">
                <Field
                  type="password"
                  name="confirmPassword"
                  className="form-control"
                  id="confirmPassword"
                  placeholder="Confirm Password"
                />
                <label htmlFor="confirmPassword">Confirm Password</label>
                <ErrorMessage name="confirmPassword" component="div" className="text-danger small mt-1" />
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
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </Form>
          )}
        </Formik>
        <div className="text-center mt-3">
          <small className="text-muted">
            Already have an account?
            <a
              href="/signin"
              className="text-decoration-none ms-1"
              style={{
                color: "#7b2ff2",
                fontWeight: 600,
                transition: "color 0.2s"
              }}
              onMouseOver={e => (e.target.style.color = "#764ba2")}
              onMouseOut={e => (e.target.style.color = "#7b2ff2")}
            >
              Sign In
            </a>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Signup;