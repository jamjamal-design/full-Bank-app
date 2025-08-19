import React from 'react';
const Loans = () => {
  const [amount, setAmount] = React.useState('');
  const [term, setTerm] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!amount || !term) {
      setError('Please fill in all fields.');
      return;
    }
    if (isNaN(amount) || isNaN(term) || Number(amount) <= 0 || Number(term) <= 0) {
      setError('Please enter valid positive numbers.');
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="container py-5">
      <h2>Apply for a Loan</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <div className="mb-3">
          <label className="form-label">Loan Amount</label>
          <input
            type="number"
            className="form-control"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            min="1"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Term (months)</label>
          <input
            type="number"
            className="form-control"
            value={term}
            onChange={e => setTerm(e.target.value)}
            min="1"
            required
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary">Apply</button>
      </form>
      {submitted && !error && (
        <div className="alert alert-success mt-4">
          Loan application submitted!<br />
          <strong>Amount:</strong> ${amount}<br />
          <strong>Term:</strong> {term} months
        </div>
      )}
    </div>
  );
};
export default Loans;
