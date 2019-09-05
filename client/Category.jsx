import React from 'react';
import Dish from './Dish';
import styles from './css_modules/category.css';

const Category = (props) => {
  const { categoryName, dishes } = props;
  const dishesArr = Object.entries(dishes);
  const mid = Math.floor(dishesArr.length / 2);
  const dishes1 = dishesArr.slice(0, mid);
  const dishes2 = dishesArr.slice(mid);
  return (
    <div>
      <h3 className={styles.name}>{categoryName}</h3>
      <br />
      <div className={styles.dishContainer}>
        <div>
          {dishes1.map(
            (dish) => (
              <div>
                <Dish name={dish[0]} description={dish[1].description} price={dish[1].price} />
                <br />
              </div>
            ),
          )}
        </div>
        <div>
          {dishes2.map(
            (dish) => (
              <div>
                <Dish name={dish[0]} description={dish[1].description} price={dish[1].price} />
                <br />
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
};

export default Category;
