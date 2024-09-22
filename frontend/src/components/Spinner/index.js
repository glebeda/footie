import React from 'react';
import './Spinner.css'; 

const Spinner = () => {
  return (
    <div className="spinner">
      <div className="spinner__circle" aria-label="Loading"></div>
    </div>
  );
};

export default Spinner;
