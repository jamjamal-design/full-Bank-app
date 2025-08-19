import React from 'react';
const Withdraw = () => {
  const [amount, setAmount] = React.useState('');
  const [balance, setBalance] = React.useState(1000); // Example starting balance
  const [message, setMessage] = React.useState('');

  const handleWithdraw = (e) => {
    e.preventDefault();
    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      setMessage('Please enter a valid amount.');
      return;
    }
    if (withdrawAmount > balance) {
      setMessage('Insufficient funds.');
      return;
    }
    setBalance(balance - withdrawAmount);
    setMessage(`Successfully withdrew $${withdrawAmount.toFixed(2)}.`);
    setAmount('');
  };

  return (
    <div className="container py-5">
      <h2>Withdraw</h2>
      <p>Current Balance: ${balance.toFixed(2)}</p>
      <form onSubmit={handleWithdraw}>
        <div className="mb-3">
          <label htmlFor="withdrawAmount" className="form-label">Amount</label>
          <input
            type="number"
            className="form-control"
            id="withdrawAmount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
            step="0.01"
            placeholder="Enter amount"
          />
        </div>
        <button type="submit" className="btn btn-primary">Withdraw</button>
      </form>
      {message && <div className="mt-3 alert alert-info">{message}</div>}
    </div>
  );
};
export default Withdraw;
