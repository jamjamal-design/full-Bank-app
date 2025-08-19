import React from 'react';
const Savings = () => {
  const [savings, setSavings] = React.useState([]);
  const [goal, setGoal] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [target, setTarget] = React.useState('');

  const handleAddSavings = (e) => {
    e.preventDefault();
    if (!goal || !amount || !target) return;
    setSavings([
      ...savings,
      {
        id: Date.now(),
        goal,
        amount: parseFloat(amount),
        target: parseFloat(target),
      },
    ]);
    setGoal('');
    setAmount('');
    setTarget('');
  };

  return (
    <div className="container py-5">
      <h2>Savings & Goals</h2>
      <form onSubmit={handleAddSavings} className="mb-4">
        <div>
          <label>Goal Name:</label>
          <input
            type="text"
            value={goal}
            onChange={e => setGoal(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <div>
          <label>Current Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            required
            min="0"
            className="form-control"
          />
        </div>
        <div>
          <label>Target Amount:</label>
          <input
            type="number"
            value={target}
            onChange={e => setTarget(e.target.value)}
            required
            min="0"
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary mt-2">Add Savings Goal</button>
      </form>
      <h4>Your Savings Goals</h4>
      {savings.length === 0 ? (
        <p>No savings goals yet.</p>
      ) : (
        <ul className="list-group">
          {savings.map(item => (
            <li key={item.id} className="list-group-item">
              <strong>{item.goal}</strong>: ${item.amount} / ${item.target}
              <div className="progress mt-2">
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: `${Math.min((item.amount / item.target) * 100, 100)}%` }}
                  aria-valuenow={item.amount}
                  aria-valuemin="0"
                  aria-valuemax={item.target}
                >
                  {Math.round((item.amount / item.target) * 100)}%
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default Savings;
