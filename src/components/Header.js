// src/components/Header.js
import '../index.css';
import '../App.css';
import '../utils/api.js'
import React from 'react';

const Header = () => {
  const handleTitleClick = (e) => {
    e.preventDefault();
    window.location.reload();
  };

  return (
    <header className="header">
      <h1 id="title">
        <a
          href="/"
          rel="noopener noreferrer"
          style={{ color: 'inherit', textDecoration: 'none' }}
          target="_self"
          onClick={handleTitleClick}
        >
          Weather App
        </a>
      </h1>
    </header>
  );
};

export default Header;