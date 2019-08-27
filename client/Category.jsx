import React from 'react';
import Dish from './Dish';

const Category = (props) => {
  const { dishes, category } = props;
  return (
    <div>
      <div>{category}</div>
      {dishes.map(
        (dish) => <Dish name={dish[0]} description={dish[1].description} price={dish[1].price} />,
      )}
    </div>
  );
};

export default Category;
