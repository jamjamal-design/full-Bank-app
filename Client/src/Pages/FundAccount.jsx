import React from 'react';
const FundAccount = () => {
  const [amount, setAmount] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setMessage('Please enter a valid amount.');
      return;
    }
    setLoading(true);
    try {
      // Replace with your API endpoint
      const response = await fetch('/api/fund-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(amount) }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Account funded successfully!');
        setAmount('');
      } else {
        setMessage(data.error || 'Failed to fund account.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="container py-5">
      <h2>Fund Account</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <div className="mb-3">
          <label htmlFor="amount" className="form-label">Amount</label>
          <input
            type="number"
            className="form-control"
            id="amount"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            min="1"
            step="0.01"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Processing...' : 'Fund Account'}
        </button>
      </form>
      {message && <div className="mt-3 alert alert-info">{message}</div>}
    </div>
  );
};

export default FundAccount;
