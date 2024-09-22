import React from 'react';
import './ErrorMessage.css'; 

const ErrorMessage = ({ message }) => {
  return (
    <div className="error-message" role="alert">
      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage;
