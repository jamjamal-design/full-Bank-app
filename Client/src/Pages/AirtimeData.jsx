import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import BottomNav from '../components/BottomNav';

const AirtimeData = () => {
  const [type, setType] = useState('airtime');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Fetch transaction history (stub)
    setHistory([
      {  date: '2025-08-10' , amount: 50000, phone: '09013058465',type: 'airtime' },
      {  date: '2025-08-09' , amount: 10000, phone: '08142315774',type: 'data' }
    ]);
  }, []);

  const handlePurchase = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const url = type === 'airtime'
  ? 'https://full-bank-app-1.onrender.com/api/opay/airtime'
  : 'https://full-bank-app-1.onrender.com/api/opay/data';
      await axios.post(url, { phone, amount }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(`${type === 'airtime' ? 'Airtime' : 'Data'} purchased successfully!`);
      setHistory([{ type, amount, phone, date: new Date().toISOString().slice(0, 10) }, ...history]);
      setPhone('');
      setAmount('');
    } catch {
      setMessage('Purchase failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-gradient" style={{ background: 'linear-gradient(135deg, #e0ffe7 0%, #b2f7ef 100%)', minHeight: '100vh' }}>
      <div className="container py-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold text-success animate__animated animate__fadeInDown">Airtime & Data</h2>
          {message && (
            <div className="alert alert-info animate__animated animate__fadeInUp">{message}</div>
          )}
        </div>
        <form
          className="card shadow-lg mb-4 p-4 border-0 animate__animated animate__zoomIn"
          style={{ borderRadius: '2rem', background: 'rgba(255,255,255,0.95)' }}
          onSubmit={handlePurchase}
        >
          <div className="row g-3 align-items-center">
            <div className="col-md-4">
              <label className="form-label fw-semibold">Type</label>
              <select
                className="form-select"
                value={type}
                onChange={e => setType(e.target.value)}
                style={{ transition: 'box-shadow 0.3s' }}
              >
                <option value="airtime">Airtime</option>
                <option value="data">Data</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">Phone Number</label>
              <input
                type="text"
                className="form-control"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Enter phone number"
                required
                maxLength={11}
                style={{ transition: 'box-shadow 0.3s' }}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">Amount</label>
              <input
                type="number"
                className="form-control"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="Enter amount"
                required
                min={50}
                style={{ transition: 'box-shadow 0.3s' }}
              />
            </div>
          </div>
          <div className="d-grid mt-4">
            <button
              className="btn btn-success btn-lg shadow animate__animated animate__pulse animate__infinite"
              type="submit"
              disabled={loading}
              style={{ borderRadius: '1.5rem', fontWeight: 600, letterSpacing: 1 }}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2" />
              ) : (
                <i className={`bi bi-lightning-charge-fill me-2 animate__animated animate__flash`} />
              )}
              Buy {type === 'airtime' ? 'Airtime' : 'Data'}
            </button>
          </div>
        </form>
        <div
          className="card shadow-lg animate__animated animate__fadeInUp"
          style={{ borderRadius: '2rem', background: 'rgba(255,255,255,0.95)' }}
        >
          <div className="card-body">
            <h5 className="fw-bold mb-3 text-success">Recent Purchases</h5>
            {history.length === 0 ? (
              <div className="text-muted text-center animate__animated animate__fadeIn">No purchases yet</div>
            ) : (
              <ul className="list-group list-group-flush">
                {history.map((tx, idx) => (
                  <li
                    className={`list-group-item d-flex justify-content-between align-items-center animate__animated animate__fadeInLeft`}
                    key={`${tx.type}-${tx.phone}-${tx.amount}-${tx.date}`}
                    style={{
                      background: idx % 2 === 0 ? '#f8fdfb' : '#e6f7f1',
                      border: 'none',
                      borderRadius: '1rem',
                      marginBottom: 8,
                      boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
                    }}
                  >
                    <span>
                      <i className={`bi ${tx.type === 'airtime' ? 'bi-phone' : 'bi-wifi'} text-success me-2`} />
                      {tx.type === 'airtime' ? 'Airtime' : 'Data'} for <span className="fw-semibold">{tx.phone}</span>
                    </span>
                    <span className="fw-bold text-success">₦{tx.amount}</span>
                    <span className="text-muted" style={{ fontSize: 12 }}>{tx.date}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      {/* <BottomNav active="airtime" /> */}
      {/* Animate.css CDN for demo: */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
      />
      {/* Bootstrap Icons CDN for icons */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
      />
    </div>
  );
};

export default AirtimeData;
