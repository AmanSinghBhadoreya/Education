import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <h2>Finwise</h2>
      <div>
        <Link to="/">Home</Link>
        <Link to="/predict">Predict</Link>
        <Link to="/about">About</Link>
      </div>
    </nav>
  );
}

export default Navbar;
