import React from 'react';

const Dish = (props) => {
  const { description, price, name } = props;
  return (
    <div>
      <div>{ name }</div>
      <div>{ description }</div>
      <div>{ price }</div>
    </div>
  )
}

export default Dish;
