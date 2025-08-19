import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAppContext } from '../context/AppContext';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, credit, debit
  const { isDarkMode } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
  const response = await axios.get('https://full-bank-app-x470.onrender.com/api/banking/transactions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.type === filter;
  });

  const getTransactionIcon = (type) => {
    return type === 'credit' ? 'fas fa-arrow-down text-success' : 'fas fa-arrow-up text-danger';
  };

  if (isLoading) {
    return (
      <div className={`min-vh-100 d-flex justify-content-center align-items-center ${isDarkMode ? 'bg-dark' : 'bg-light'}`}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-vh-100 ${isDarkMode ? 'bg-dark' : 'bg-light'} py-0`}>
      {/* Animated Header */}
      <div
        className={`position-relative shadow-sm ${isDarkMode ? 'bg-gradient-dark border-secondary' : 'bg-gradient-primary border-light'} border-bottom`}
        style={{
          minHeight: 120,
          background: isDarkMode
            ? 'linear-gradient(90deg, #232526 0%, #414345 100%)'
            : 'linear-gradient(90deg, #e0eafc 0%, #cfdef3 100%)',
          animation: 'slideDown 0.7s cubic-bezier(.77,0,.18,1) both'
        }}
      >
        <style>
          {`
            @keyframes slideDown {
              0% { transform: translateY(-40px); opacity: 0; }
              100% { transform: translateY(0); opacity: 1; }
            }
            @keyframes fadeInUp {
              0% { transform: translateY(30px); opacity: 0; }
              100% { transform: translateY(0); opacity: 1; }
            }
            .transaction-card {
              transition: box-shadow 0.2s, transform 0.2s;
              will-change: transform;
            }
            .transaction-card:hover {
              box-shadow: 0 8px 24px rgba(0,0,0,0.12);
              transform: translateY(-4px) scale(1.01);
            }
            .filter-btn-anim {
              animation: fadeInUp 0.5s both;
            }
          `}
        </style>
        <div className="container py-4">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <button
                className={`btn btn-lg rounded-circle shadow-sm ${isDarkMode ? 'btn-outline-light' : 'btn-outline-dark'}`}
                onClick={() => navigate('/dashboard')}
                style={{ width: 44, height: 44, fontSize: 20, animation: 'fadeInUp 0.6s 0.1s both' }}
              >
                <i className="fas fa-arrow-left"></i>
              </button>
              <h2 className={`mb-0 fw-bold ${isDarkMode ? 'text-light' : 'text-dark'}`} style={{ animation: 'fadeInUp 0.7s 0.2s both' }}>
                Transactions
              </h2>
            </div>
            <button
              className={`btn btn-lg rounded-circle shadow-sm ${isDarkMode ? 'btn-outline-light' : 'btn-outline-primary'}`}
              onClick={fetchTransactions}
              style={{ width: 44, height: 44, fontSize: 20, animation: 'fadeInUp 0.7s 0.3s both' }}
              title="Refresh"
            >
              <i className="fas fa-sync-alt"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="container py-5">
        {/* Animated Filter Buttons */}
        <div className="row mb-4">
          <div className="col-12 d-flex justify-content-center gap-3">
            <button
              type="button"
              className={`btn filter-btn-anim ${filter === 'all' ? 'btn-primary shadow' : (isDarkMode ? 'btn-outline-light' : 'btn-outline-primary')}`}
              style={{ minWidth: 120, animationDelay: '0.1s' }}
              onClick={() => setFilter('all')}
            >
              <i className="fas fa-list me-2"></i>All
            </button>
            <button
              type="button"
              className={`btn filter-btn-anim ${filter === 'credit' ? 'btn-success shadow' : (isDarkMode ? 'btn-outline-light' : 'btn-outline-success')}`}
              style={{ minWidth: 120, animationDelay: '0.2s' }}
              onClick={() => setFilter('credit')}
            >
              <i className="fas fa-arrow-down me-2"></i>Money In
            </button>
            <button
              type="button"
              className={`btn filter-btn-anim ${filter === 'debit' ? 'btn-danger shadow' : (isDarkMode ? 'btn-outline-light' : 'btn-outline-danger')}`}
              style={{ minWidth: 120, animationDelay: '0.3s' }}
              onClick={() => setFilter('debit')}
            >
              <i className="fas fa-arrow-up me-2"></i>Money Out
            </button>
          </div>
        </div>

        {/* Transactions List with Animation */}
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-5" style={{ animation: 'fadeInUp 0.7s both' }}>
            <i className={`fas fa-receipt fa-4x mb-3 ${isDarkMode ? 'text-light' : 'text-muted'}`}></i>
            <h5 className={`${isDarkMode ? 'text-light' : 'text-muted'}`}>No transactions found</h5>
            <p className={`${isDarkMode ? 'text-light' : 'text-muted'}`}>
              {filter === 'all' ? "You haven't made any transactions yet" : `No ${filter} transactions found`}
            </p>
          </div>
        ) : (
          <div className="row g-4">
            {filteredTransactions.map((transaction, index) => (
              <div
                key={index}
                className="col-12 col-md-6 col-lg-4"
                style={{ animation: `fadeInUp 0.5s ${0.1 + index * 0.07}s both` }}
              >
                <div
                  className={`transaction-card card border-0 shadow-sm ${isDarkMode ? 'bg-dark text-light' : 'bg-white'}`}
                  style={{
                    borderRadius: 20,
                    overflow: 'hidden',
                    minHeight: 160,
                    background: isDarkMode
                      ? 'linear-gradient(135deg, #232526 0%, #414345 100%)'
                      : 'linear-gradient(135deg, #f8fafc 0%, #e0eafc 100%)'
                  }}
                >
                  <div className="card-body d-flex flex-column justify-content-between h-100">
                    <div className="d-flex align-items-center mb-2">
                      <div
                        className={`me-3 d-flex align-items-center justify-content-center`}
                        style={{
                          width: 54,
                          height: 54,
                          borderRadius: '50%',
                          background: transaction.type === 'credit'
                            ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
                            : 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                          animation: 'fadeInUp 0.5s both'
                        }}
                      >
                        <i
                          className={getTransactionIcon(transaction.type)}
                          style={{
                            fontSize: 24,
                            color: transaction.type === 'credit' ? '#155724' : '#721c24'
                          }}
                        ></i>
                      </div>
                      <div>
                        <h6 className="mb-1 fw-bold">{transaction.description}</h6>
                        <small className={`${isDarkMode ? 'text-light' : 'text-muted'}`}>
                          {formatDate(transaction.date)}
                        </small>
                        {transaction.type === 'credit' && transaction.senderAccountNumber && (
                          <div>
                            <small className={`${isDarkMode ? 'text-light' : 'text-muted'}`}>
                              From: {transaction.senderAccountNumber}
                            </small>
                          </div>
                        )}
                        {transaction.type === 'debit' && transaction.recipientAccountNumber && (
                          <div>
                            <small className={`${isDarkMode ? 'text-light' : 'text-muted'}`}>
                              To: {transaction.recipientAccountNumber}
                            </small>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="d-flex align-items-end justify-content-between mt-2">
                      <div>
                        <span
                          className={`fw-bold fs-5 ${transaction.type === 'credit' ? 'text-success' : 'text-danger'}`}
                        >
                          {transaction.type === 'credit' ? '+' : '-'}
                          {formatCurrency(transaction.amount)}
                        </span>
                      </div>
                      <span
                        className={`badge rounded-pill px-3 py-2 fs-6 ${transaction.type === 'credit' ? 'bg-success' : 'bg-danger'}`}
                        style={{ opacity: 0.9 }}
                      >
                        {transaction.type === 'credit' ? 'Received' : 'Sent'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
