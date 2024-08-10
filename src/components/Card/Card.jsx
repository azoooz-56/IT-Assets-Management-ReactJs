import React from 'react';
import PropTypes from 'prop-types';
import './Card.css';

function Card({ icon, title, number }) {
  const iconClassName = `card-icon fa-solid fa-${icon}`;

  return (
    <div className="card">
      <div className="card-image">
        <i className={iconClassName} />
      </div>
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-number">{number}</p>
      </div>
    </div>
  );
}

Card.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  number: PropTypes.number.isRequired,
};

export default Card;
