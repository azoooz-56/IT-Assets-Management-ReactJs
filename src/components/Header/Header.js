import React from 'react';
import PropTypes from 'prop-types';
import AppLogo from '../../assets/images/logo.png'; // Update path as needed
import './Header.css';

function Header({ title }) {
  return (
    <div className="header">
      <img className="header-logo" src={AppLogo} alt="App Logo" />
      <h1 className="header-title">{title}</h1>
    </div>
  );
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Header;
