import React from 'react';
import styles from './css_modules/mealOption.css';

const MealOption = (props) => {
  const { menuOption, changeMeal } = props;
  return (
    <button type="button" className={styles.btn} onClick={() => changeMeal(menuOption)}>{ menuOption }</button>
  );
};

export default MealOption;
