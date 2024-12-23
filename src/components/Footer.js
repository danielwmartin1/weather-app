// src/components/Footer.js
import '../index.css';
import '../App.css';
import '../utils/api.js'
import React from 'react';

const Footer = () => {
const currentYear = new Date().getFullYear();
return (
    <footer className="footer">
        <p>Daniel Martin &copy; {currentYear}</p>
    </footer>
);
};

export default Footer;