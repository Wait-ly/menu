import React from 'react';
import $ from 'jquery';
import MealOption from './MealOption';
import Category from './Category';
import sample from '../database/sampleData';
import HideButton from './HideButton';
import styles from './css_modules/app.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuData: sample, // array
      menuView: [{ Brunch: true }, { Dinner: false }],
      visibility: ['View full menu', false],
    };
    this.getMenuData = this.getMenuData.bind(this);
    this.handleViewChange = this.handleViewChange.bind(this);
    this.handleVisibility = this.handleVisibility.bind(this);
  }

  // gets menu data as soon as page renders
  componentDidMount() {
    this.getMenuData(() => {
      const { menuData } = this.state;
      const mealOptions = Object.keys(menuData[0]);
      const meal0 = { [mealOptions[0]]: true };
      const memo = mealOptions.map((meal) => ({ [meal]: false }));
      memo[0] = meal0;
      this.setState({ menuView: memo });
    });
  }

  // get menu data from server
  getMenuData(cb = null) {
    const id = window.location.pathname.split('/')[1];
    $.get('api/' + (id === undefined ? '1' : id) + '/menu', (result) => {
      this.setState({ menuData: result }, () => cb());
    });
  }

  // handles button click changing states
  handleViewChange(curr) {
    const { menuView } = this.state;
    const views = menuView.map((meal) => {
      const mealKey = Object.keys(meal);
      if (mealKey[0] === curr) {
        return { [curr]: true };
      }
      return { [mealKey]: false };
    });

    this.setState({ menuView: views });
  }

  // handles rendering the bottom half of the menu
  handleVisibility() {
    const { visibility } = this.state;
    if (visibility[1] === true) {
      this.setState({ visibility: ['View full menu', false] });
    } else {
      this.setState({ visibility: ['Collapse Menu', true] });
    }
  }


  render() {
    const { menuData, menuView, visibility } = this.state;
    const meals = Object.entries(menuData[0]);
    // handles conditional rendering
    let mealTime;
    let mealTime2 = [];
    menuView.forEach((meal) => {
      const mealKey = Object.keys(meal);
      if (meal[mealKey[0]] === true) {
        const categories = Object.entries(menuData[0][mealKey[0]]);
        const categories1 = categories.slice(0, 2);
        const categories2 = categories.slice(2, categories.length);

        mealTime = categories1.map((category) => {
          const dishes = Object.entries(category[1]);
          return (
            <div>
              <Category category={category[0]} dishes={dishes} />
              <hr />
            </div>
          );
        });

        if (visibility[1] === true) {
          mealTime2 = categories2.map((category) => {
            const dishes = Object.entries(category[1]);
            return (
              <div>
                <Category category={category[0]} dishes={dishes} />
                <hr />
              </div>
            );
          });
        }
      }
    });

    return (
      <div className={styles.masterContainer}>
        <h1>Menu</h1>
        <div>
          <hr />
          <div className={styles.mealOptions}>
            {meals.map(
              (meal) => {
                let bool;
                menuView.map((piece) => {
                  const b = Object.entries(piece);
                  if (b[0][0] === meal[0]) {
                    // eslint-disable-next-line prefer-destructuring
                    bool = b[0][1];
                  }
                  return bool;
                });
                return (
                  <MealOption selected={bool} changeMeal={this.handleViewChange} menuOption={meal[0]} />
                );
              },
            )}
          </div>
          <hr />
        </div>
        <div className={visibility[1] ? styles.meals2 : styles.meals}>
          {mealTime}
          {mealTime2}
        </div>
        <HideButton handleVisibility={this.handleVisibility} visibility={visibility[0]} />
      </div>
    );
  }
}

export default App;
