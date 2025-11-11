import React from 'react';
import { useLocation } from 'react-router-dom';

function Result() {
  const location = useLocation();
  const { prediction } = location.state || { prediction: "No result yet" };

  return (
    <div style={{ textAlign: 'center', marginTop: 80 }}>
      <h2>Prediction Result</h2>
      <p>Your loan approval status: <strong>{prediction}</strong></p>
    </div>
  );
}

export default Result;
