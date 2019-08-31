import React from 'react';
import styles from './css_modules/dish.css';

const Dish = (props) => {
  const { description, price, name } = props;
  const caps = name.charAt(0).toUpperCase() + name.slice(1);

  return (
    <div>
      <div className={styles.container}>
        <h3 className={styles.name}>{ caps }</h3>
        <div className={styles.name}>{ `$${price}` }</div>
      </div>
      <br />
      <div className={styles.description}>{ description }</div>
    </div>
  );
};

export default Dish;
