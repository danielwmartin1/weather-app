// src/components/Header.js
import '../index.css';
import '../App.css';
import '../utils/api.js'
import React from 'react';

const Header = () => {
  return (
    <header className="header">
      <h1 id="title">
        <a style={{ textDecoration: 'none', color: "var(--color-accent)" }} href="https://dwm-weather.vercel.app/" target="_blank" rel="noopener noreferrer">
          Weather App
        </a>
      </h1>
    </header>
  );
};

export default Header;