import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div style={{ textAlign: 'center', marginTop: 60 }}>
      <h1>Welcome to Finwise</h1>
      <p>Your AI-based Loan Eligibility Assistant</p>
      <Link to="/predict">
        <button>Start Prediction</button>
      </Link>
    </div>
  );
}

export default Home;
