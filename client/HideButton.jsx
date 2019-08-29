import React from 'react';
import styles from './css_modules/hideButton.css';

const HideButton = (props) => {
  const { visibility, handleVisibility } = props;
  return (
    <button type="button" className="btn" onClick={() => handleVisibility()}>{visibility}</button>
  );
};

export default HideButton;
