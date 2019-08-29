import React from 'react';

const MealOption = (props) => {
  const { menuOption, changeMeal } = props;
  return (
    <button type="button" className={menuOption} onClick={() => changeMeal(menuOption)}>{ menuOption }</button>
  );
};

export default MealOption;
