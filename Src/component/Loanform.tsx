import React, { useState } from 'react';
import axios from 'axios';

interface LoanInput {
  income: number;
  amount: number;
  credit: number;
  tenure: number;
}

const LoanForm: React.FC = () => {
  const [data, setData] = useState<LoanInput>({
    income: 0,
    amount: 0,
    credit: 0,
    tenure: 0
  });
  const [result, setResult] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Replace with actual backend endpoint
      const res = await axios.post('http://localhost:5000/predict', data);
      setResult(res.data.prediction);
    } catch {
      setResult('Server not reachable. Try again later.');
    }
  };

  return (
    <div className="form-container">
      <h2>Loan Eligibility Prediction</h2>
      <form onSubmit={handleSubmit}>
        <input type="number" name="income" placeholder="Applicant Income" onChange={handleChange} />
        <input type="number" name="amount" placeholder="Loan Amount" onChange={handleChange} />
        <input type="number" name="credit" placeholder="Credit History (0 or 1)" onChange={handleChange} />
        <input type="number" name="tenure" placeholder="Loan Tenure (months)" onChange={handleChange} />
        <button type="submit">Predict</button>
      </form>
      {result && <p className="result">{result}</p>}
    </div>
  );
};

export default LoanForm;
