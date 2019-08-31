import React from 'react';
import Dish from './Dish';
import styles from './css_modules/category.css';

const Category = (props) => {
  const { dishes, category } = props;
  return (
    <div>
      <h3 className={styles.name}>{category}</h3>
      <br />
      {dishes.map(
        (dish) => (
          <div>
            <Dish name={dish[0]} description={dish[1].description} price={dish[1].price} />
            <br />
          </div>
        ),
      )}
    </div>
  );
};

export default Category;
