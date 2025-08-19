import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BottomNav from '../components/BottomNav';

const Cards = () => {
  // Handle card request (virtual/physical)
  const handleRequestCard = async () => {
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      // This should call your backend endpoint for requesting a card
  await axios.post('https://full-bank-app-1.onrender.com/api/opay/cards/request', { type: cardType }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(`Requested a ${cardType} card successfully!`);
      setShowRequest(false);
      // Optionally refresh cards list
    } catch {
      setMessage('Failed to request card (backend route missing or not implemented)');
    }
  };
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Card request modal state
  const [showRequest, setShowRequest] = useState(false);
  const [cardType, setCardType] = useState('virtual');

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const token = localStorage.getItem('token');
        // Fallback for missing backend route
  const res = await axios.get('https://full-bank-app-1.onrender.com/api/opay/cards', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCards(res.data.cards || []);
      } catch (err) {
        setMessage('Failed to fetch cards (backend route missing or not implemented)');
        setCards([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCards();
  }, []);

  const handleBlock = async (type, status) => {
    setMessage('');
    try {
      const token = localStorage.getItem('token');
  await axios.post('https://full-bank-app-1.onrender.com/api/opay/cards/block', { type, status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCards(cards.map(card => card.type === type ? { ...card, status } : card));
      setMessage(`Card ${status === 'blocked' ? 'blocked' : 'unblocked'} successfully`);
    } catch {
      setMessage('Failed to update card status');
    }
  };

  return (
    <div className="min-vh-100 bg-gradient" style={{ background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)' }}>
      <div className="container py-4">
        <h3 className="mb-4 text-primary fw-bold animate__animated animate__fadeInDown">My Cards</h3>
        {message && (
          <div className="alert alert-info animate__animated animate__fadeIn">
            {message}
          </div>
        )}
        {/* Card Request UI */}
        <div className="mb-4 text-center">
          <button
            className="btn btn-lg btn-gradient-primary shadow animate__animated animate__pulse"
            style={{
              background: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)',
              color: '#fff',
              border: 'none'
            }}
            onClick={() => setShowRequest(true)}
          >
            <i className="bi bi-plus-circle me-2"></i>Request New Card
          </button>
          {showRequest && (
            <div className="card p-4 mt-3 mx-auto animate__animated animate__zoomIn" style={{ maxWidth: 350, borderRadius: 20 }}>
              <label className="fw-semibold mb-2">Choose Card Type:</label>
              <select
                className="form-select mb-3"
                value={cardType}
                onChange={e => setCardType(e.target.value)}
              >
                <option value="virtual">Virtual Card</option>
                <option value="physical">Physical Card</option>
              </select>
              <button
                className="btn btn-success w-100 mb-2 animate__animated animate__pulse"
                onClick={handleRequestCard}
              >
                <i className="bi bi-send me-1"></i>Submit Request
              </button>
              <button
                className="btn btn-link w-100"
                onClick={() => setShowRequest(false)}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        {loading ? (
          <div className="text-center py-5">
            <span className="spinner-border text-primary animate__animated animate__fadeIn" />
          </div>
        ) : (
          cards.length === 0 ? (
            <div className="text-center py-5 text-muted animate__animated animate__fadeIn">
              <i className="bi bi-credit-card display-4 mb-2"></i>
              <div>No cards found</div>
            </div>
          ) : (
            <div className="row g-4">
              {cards.map((card, idx) => (
                <div className="col-md-6" key={card.type}>
                  <div
                    className={`card shadow-lg border-0 animate__animated animate__fadeInUp`}
                    style={{
                      borderRadius: '2rem',
                      background: card.type === 'virtual'
                        ? 'linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)'
                        : 'linear-gradient(120deg, #fbc2eb 0%, #a6c1ee 100%)',
                      color: '#222',
                      minHeight: 220,
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <div className="card-body d-flex flex-column justify-content-between h-100">
                      <div>
                        <div className="d-flex align-items-center mb-2">
                          <i className={`bi ${card.type === 'virtual' ? 'bi-credit-card-2-front' : 'bi-credit-card'} fs-3 me-2`}></i>
                          <h5 className="mb-0 fw-bold">{card.type === 'virtual' ? 'Virtual Card' : 'Physical Card'}</h5>
                        </div>
                        <p className="fs-4 fw-bold letter-spacing-wider mb-1 animate__animated animate__fadeIn">
                          **** **** **** {card.last4}
                        </p>
                        <span className={`badge px-3 py-2 mb-2 ${card.status === 'active' ? 'bg-success' : 'bg-danger'} animate__animated animate__pulse`}>
                          {card.status === 'active' ? 'Active' : 'Blocked'}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between gap-2 mt-3">
                        <button
                          className="btn btn-outline-success flex-fill animate__animated animate__fadeInLeft"
                          disabled={card.status === 'active'}
                          onClick={() => handleBlock(card.type, 'active')}
                        >
                          <i className="bi bi-unlock me-1"></i>Unblock
                        </button>
                        <button
                          className="btn btn-outline-danger flex-fill animate__animated animate__fadeInRight"
                          disabled={card.status === 'blocked'}
                          onClick={() => handleBlock(card.type, 'blocked')}
                        >
                          <i className="bi bi-lock me-1"></i>Block
                        </button>
                      </div>
                    </div>
                    {/* Decorative circles */}
                    <div style={{
                      position: 'absolute',
                      top: -30,
                      right: -30,
                      width: 80,
                      height: 80,
                      background: 'rgba(255,255,255,0.2)',
                      borderRadius: '50%',
                      zIndex: 0
                    }} />
                    <div style={{
                      position: 'absolute',
                      bottom: -20,
                      left: -20,
                      width: 60,
                      height: 60,
                      background: 'rgba(255,255,255,0.15)',
                      borderRadius: '50%',
                      zIndex: 0
                    }} />
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
      <BottomNav active="cards" />
      {/* Animate.css CDN for demo, remove if already included in your project */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
      />
      {/* Bootstrap Icons CDN for demo, remove if already included in your project */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
      />
    </div>
  );
};

export default Cards;
