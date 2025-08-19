import React from 'react';
import BottomNav from '../components/BottomNav';

const Finances = () => {
  return (
    <div className="min-vh-100 bg-gradient-to-br from-green-100 to-green-300 animate-fadeIn">
      <div className="container py-5">
        <h2 className="mb-5 text-center text-success fw-bold animate-slideDown">Your Finances</h2>
        <div className="row g-4 justify-content-center">
          <div className="col-md-5">
            <div className="card border-0 shadow-lg finance-card animate-popIn" style={{ borderRadius: '2rem', transition: 'transform 0.3s' }}>
              <div className="card-body text-center">
                <div className="mb-3">
                  <i className="bi bi-piggy-bank-fill text-success" style={{ fontSize: '2.5rem' }}></i>
                </div>
                <h4 className="fw-semibold">Savings</h4>
                <p className="fs-5 mb-2">₦50,000</p>
                <button className="btn btn-success px-4 animate-bounce">View Savings</button>
              </div>
            </div>
          </div>
          <div className="col-md-5">
            <div className="card border-0 shadow-lg finance-card animate-popIn" style={{ borderRadius: '2rem', transition: 'transform 0.3s' }}>
              <div className="card-body text-center">
                <div className="mb-3">
                  <i className="bi bi-cash-coin text-warning" style={{ fontSize: '2.5rem' }}></i>
                </div>
                <h4 className="fw-semibold">Loans</h4>
                <p className="fs-5 mb-2">₦10,000</p>
                <button className="btn btn-warning px-4 animate-bounce">View Loans</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BottomNav active="finances" />
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 1s ease;
        }
        .animate-slideDown {
          animation: slideDown 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-popIn {
          animation: popIn 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-bounce {
          animation: bounce 1.2s infinite alternate;
        }
        @keyframes fadeIn {
          from { opacity: 0 }
          to { opacity: 1 }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-40px);}
          to { opacity: 1; transform: translateY(0);}
        }
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.8);}
          100% { opacity: 1; transform: scale(1);}
        }
        @keyframes bounce {
          from { transform: translateY(0);}
          to { transform: translateY(-10px);}
        }
        .finance-card:hover {
          transform: translateY(-8px) scale(1.03);
        }
      `}</style>
      {/* Make sure to include Bootstrap Icons in your index.html or project */}
    </div>
  );
};

export default Finances;
