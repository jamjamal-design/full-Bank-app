
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppContext } from '../context/AppContext';
import jamalBank from '../../image/jamalBank.png';
import Cards from './Cards';
import AirtimeData from './AirtimeData';
import Savings from './Savings';
import { useNavigate, useLocation } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

const Dashboard = () => {
  const formatCurrency = (amount) => {
    if (typeof amount !== 'number') return '₦0.00';
    return '₦' + amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const [notifications, setNotifications] = useState([]);
  const [analytics, setAnalytics] = useState({ totalSpent: 0, totalReceived: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const { user, setUser, isDarkMode, toggleTheme, isBalanceVisible, toggleBalanceVisibility, logout } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token || !userData) {
      navigate('/signin');
      return;
    }
    // Fetch transactions and notifications
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [txRes, notifRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL || 'https://full-bank-app-1.onrender.com/api/banking'}/transactions`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${import.meta.env.VITE_API_URL || 'https://full-bank-app-1.onrender.com/api/opay'}/notifications`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setTransactions(txRes.data.transactions || []);
        setNotifications(notifRes.data.notifications || []);
        // Calculate analytics
        let totalSpent = 0, totalReceived = 0;
        (txRes.data.transactions || []).forEach(tx => {
          if (tx.type === 'debit') totalSpent += tx.amount;
          if (tx.type === 'credit') totalReceived += tx.amount;
        });
        setAnalytics({ totalSpent, totalReceived });
      } catch (err) {
        // fallback: do nothing
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [navigate, setUser, user]);

  if (!user) {
    return (
      <div className={`min-vh-100 ${isDarkMode ? 'bg-dark' : 'bg-light'} d-flex justify-content-center align-items-center`}>
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  return (
 // ...existing code...
    <div
      className={`min-vh-100 d-flex flex-column ${isDarkMode ? 'bg-gradient-dark' : 'bg-gradient-light'}`}
      style={{
        minHeight: '100vh',
        background: isDarkMode
          ? 'linear-gradient(135deg, #232526 0%, #414345 100%)'
          : 'linear-gradient(135deg, #e0f7fa 0%, #fff 100%)',
        transition: 'background 0.5s'
      }}
    >
      {/* Top Navigation Bar */}
      <nav
        className={`navbar navbar-expand-md ${isDarkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-white'} shadow`}
        style={{
          animation: 'slideDown 0.7s cubic-bezier(.23,1.01,.32,1) both'
        }}
      >
        <div className="container-fluid">
          <span className="navbar-brand d-flex align-items-center gap-2">
            <img
              src={jamalBank}
              alt="Jamal Bank Logo"
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                boxShadow: '0 2px 8px #00bcd433'
              }}
            />
            <span className="fw-bold" style={{ color: isDarkMode ? '#43e97b' : '#00bcd4' }}>Jamal Bank</span>
          </span>
          <div className="d-flex align-items-center gap-2 ms-auto">
            <button className="btn btn-outline-primary" onClick={toggleTheme} title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
              <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'} fa-lg`}></i>
            </button>
            <button className="btn btn-outline-danger" onClick={() => { logout(); navigate('/signin'); }} title="Log Out">
              <i className="fas fa-sign-out-alt me-2"></i> Log Out
            </button>
          </div>
        </div>
      </nav>

      <div className="container-fluid flex-grow-1 py-4">
        {/* Greeting & Balance */}
        <div className="row mb-4">
          <div className="col-12 col-md-8 mb-3 mb-md-0">
            <div
              className={`p-4 rounded-5 shadow-lg d-flex flex-column flex-md-row align-items-center justify-content-between ${isDarkMode ? 'bg-dark text-light' : 'bg-white'}`}
              style={{
                background: isDarkMode
                  ? 'linear-gradient(90deg, #232526 0%, #43e97b 100%)'
                  : 'linear-gradient(90deg, #e0f7fa 0%, #43e97b 100%)',
                animation: 'fadeInUp 0.8s cubic-bezier(.23,1.01,.32,1) both'
              }}
            >
              <div>
                <h4 className="fw-bold mb-1" style={{ color: isDarkMode ? '#43e97b' : '#00bcd4' }}>
                  Hello, {user.firstName} {user.lastName}
                </h4>
                <div className="text-muted small">Welcome back!</div>
                <div className="mt-3">
                  <span className="me-2 text-muted">Total Balance</span>
                  <button className="btn btn-sm btn-outline-secondary" onClick={toggleBalanceVisibility}>
                    <i className={`fas ${isBalanceVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
                <h2 className="fw-bold mt-2" style={{ color: isDarkMode ? '#fff' : '#009688', letterSpacing: 1 }}>
                  {isBalanceVisible ? formatCurrency(user.accountBalance) : '₦****'}
                </h2>
                <div className="mt-2 text-muted">Acct: <span className="fw-semibold">{user.accountNumber}</span></div>
              </div>
              <div className="d-none d-md-block">
                <img
                  src={jamalBank}
                  alt="Bank"
                  style={{
                    width: 90,
                    height: 90,
                    borderRadius: '50%',
                    boxShadow: '0 2px 16px #43e97b33',
                    animation: 'bounceIn 0.7s'
                  }}
                />
              </div>
            </div>
          </div>
          {/* Quick Actions as animated grid */}
          <div className="col-12 col-md-4">
            <div
              className={`p-3 rounded-5 shadow-lg h-100 d-flex flex-md-column flex-row gap-2 justify-content-around align-items-center ${isDarkMode ? 'bg-dark text-light' : 'bg-white'}`}
              style={{
                background: isDarkMode
                  ? 'linear-gradient(135deg, #232526 0%, #43e97b 100%)'
                  : 'linear-gradient(135deg, #e0f7fa 0%, #43e97b 100%)',
                animation: 'fadeInRight 0.8s cubic-bezier(.23,1.01,.32,1) both'
              }}
            >
              {[
                { label: 'Transfer', icon: 'fa-exchange-alt', color: 'primary', path: '/transfer' },
                { label: 'Fund', icon: 'fa-wallet', color: 'success', path: '/fund-account' },
                { label: 'Withdraw', icon: 'fa-money-bill-wave', color: 'warning', path: '/withdraw' },
                { label: 'Airtime', icon: 'fa-mobile-alt', color: 'info', path: '/airtime-data' },
              ].map((action) => {
                const isActive = location.pathname === action.path || (action.path === '/transfer' && location.pathname === '/dashboard');
                return (
                  <button
                    key={action.label}
                    className={`btn btn-${action.color} d-flex flex-column align-items-center mb-md-2 ${isActive ? 'shadow-lg' : ''}`}
                    style={{
                      minWidth: 70,
                      background: isActive
                        ? 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)'
                        : undefined,
                      color: isActive ? '#fff' : undefined,
                      transition: 'background 0.2s, color 0.2s'
                    }}
                    onClick={() => navigate(action.path)}
                  >
                    <i className={`fas ${action.icon} fa-lg mb-1`}></i>
                    <span className="small">{action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Cards, Airtime/Data, Savings summaries in horizontal cards */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="card h-100 shadow-lg border-0" style={{ animation: 'fadeInUp 1s 0.1s both' }}>
              <div className="card-body">
                <Cards summaryOnly />
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 shadow-lg border-0" style={{ animation: 'fadeInUp 1s 0.2s both' }}>
              <div className="card-body">
                <AirtimeData quickPurchaseOnly />
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 shadow-lg border-0" style={{ animation: 'fadeInUp 1s 0.3s both' }}>
              <div className="card-body">
                <Savings summaryOnly />
              </div>
            </div>
          </div>
        </div>

        {/* Analytics & Notifications in a single row */}
        <div className="row g-3 mb-4">
          <div className="col-md-7">
            <div className="card h-100 shadow-lg border-0" style={{ animation: 'fadeInLeft 1s 0.2s both' }}>
              <div className="card-body">
                <h6 className="fw-bold mb-3" style={{ color: '#43e97b' }}>Analytics</h6>
                <div className="row">
                  <div className="col-6">
                    <div className="text-muted">Total Spent</div>
                    <div className="fw-semibold" style={{ color: '#e53935' }}>{formatCurrency(analytics.totalSpent)}</div>
                  </div>
                  <div className="col-6">
                    <div className="text-muted">Total Received</div>
                    <div className="fw-semibold" style={{ color: '#43e97b' }}>{formatCurrency(analytics.totalReceived)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-5">
            <div className="card h-100 shadow-lg border-0" style={{ animation: 'fadeInRight 1s 0.2s both' }}>
              <div className="card-body">
                <h6 className="fw-bold mb-3" style={{ color: '#00bcd4' }}>Notifications</h6>
                {notifications.length === 0 ? (
                  <div className="text-muted small">No notifications</div>
                ) : (
                  <ul className="list-unstyled mb-0" style={{ maxHeight: 120, overflowY: 'auto' }}>
                    {notifications.slice(0, 4).map((notif, idx) => (
                      <li key={idx} className="mb-2 d-flex align-items-start">
                        <i className="fas fa-bell" style={{ color: '#ffc107', marginRight: 8, marginTop: 4 }}></i>
                        <div>
                          <div className="fw-semibold">{notif.title || 'Notification'}</div>
                          <div className="small text-muted">{notif.message || notif.body}</div>
                          <div className="small text-secondary">{notif.date ? new Date(notif.date).toLocaleString() : ''}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions in a card */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-lg border-0" style={{ animation: 'fadeInUp 1s 0.4s both' }}>
              <div className="card-body">
                <h6 className="fw-bold mb-3" style={{ color: '#009688' }}>Recent Transactions</h6>
                {isLoading ? (
                  <div className="text-center py-4"><div className="spinner-border text-primary" /></div>
                ) : transactions.length === 0 ? (
                  <div className="text-muted small">No transactions yet</div>
                ) : (
                  <div style={{ maxHeight: 220, overflowY: 'auto' }}>
                    <table className="table table-borderless align-middle mb-0">
                      <tbody>
                        {transactions.slice(0, 6).map((tx, idx) => (
                          <tr key={idx}>
                            <td><i className={`fas ${tx.type === 'debit' ? 'fa-arrow-up' : 'fa-arrow-down'}`} style={{ color: tx.type === 'debit' ? '#e53935' : '#43e97b' }}></i></td>
                            <td>{tx.description || 'Transaction'}</td>
                            <td>{tx.date ? new Date(tx.date).toLocaleDateString() : ''}</td>
                            <td className="fw-bold" style={{ color: tx.type === 'debit' ? '#e53935' : '#43e97b' }}>
                              {tx.type === 'debit' ? '-' : '+'}{formatCurrency(tx.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* More Features as icon grid */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-lg border-0" style={{ animation: 'fadeInUp 1s 0.5s both' }}>
              <div className="card-body">
                <h6 className="fw-bold mb-3" style={{ color: '#43e97b' }}>More Features</h6>
                <div className="row text-center g-3">
                  <div className="col-6 col-md-3">
                    <button className="btn btn-outline-primary w-100 py-3" style={{ borderRadius: 20 }} onClick={() => navigate('/loans')}>
                      <i className="fas fa-hand-holding-usd fa-lg mb-1"></i>
                      <div>Loans</div>
                    </button>
                  </div>
                  <div className="col-6 col-md-3">
                    <button className="btn btn-outline-success w-100 py-3" style={{ borderRadius: 20 }} onClick={() => navigate('/support')}>
                      <i className="fas fa-headset fa-lg mb-1"></i>
                      <div>Support</div>
                    </button>
                  </div>
                  <div className="col-6 col-md-3">
                    <button className="btn btn-outline-warning w-100 py-3" style={{ borderRadius: 20 }} onClick={() => navigate('/me')}>
                      <i className="fas fa-user-cog fa-lg mb-1"></i>
                      <div>Profile</div>
                    </button>
                  </div>
                  <div className="col-6 col-md-3">
                    <button className="btn btn-outline-info w-100 py-3" style={{ borderRadius: 20 }} onClick={() => navigate('/notifications')}>
                      <i className="fas fa-bell fa-lg mb-1"></i>
                      <div>Notifications</div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation for Mobile */}
        <div className="fixed-bottom d-md-none">
          {(() => {
            let active = 'home';
            if (location.pathname.startsWith('/finances')) active = 'finances';
            else if (location.pathname.startsWith('/cards')) active = 'cards';
            else if (location.pathname.startsWith('/airtime-data')) active = 'airtime';
            else if (location.pathname.startsWith('/me') || location.pathname.startsWith('/profile')) active = 'me';
            return <BottomNav active={active} />;
          })()}
        </div>
      </div>
      {/* Animations */}
      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(40px);}
          100% { opacity: 1; transform: translateY(0);}
        }
        @keyframes fadeInRight {
          0% { opacity: 0; transform: translateX(40px);}
          100% { opacity: 1; transform: translateX(0);}
        }
        @keyframes fadeInLeft {
          0% { opacity: 0; transform: translateX(-40px);}
          100% { opacity: 1; transform: translateX(0);}
        }
        @keyframes bounceIn {
          0% { transform: scale(0.7);}
          60% { transform: scale(1.1);}
          100% { transform: scale(1);}
        }
        @keyframes slideDown {
          0% { opacity: 0; transform: translateY(-40px);}
          100% { opacity: 1; transform: translateY(0);}
        }
      `}</style>
        {<BottomNav active="dashboardNew" /> }
    </div>

  );
// ...existing code...
};

export default Dashboard;
