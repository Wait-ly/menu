import React from 'react';
import $ from 'jquery';
import MealOption from './MealOption';
import Category from './Category';
import sample from '../database/sampleData';
import HideButton from './HideButton';
import styles from './css_modules/app.css';

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: sample, // array
      menuView: [{ Brunch: true }, { Dinner: false }],
      selectedMealOption: 'Brunch',
      fullMenuIsVisible: false,
    };
    this.getMenuData = this.getMenuData.bind(this);
    this.handleViewChange = this.handleViewChange.bind(this);
    this.handleVisibility = this.handleVisibility.bind(this);
    this.getMealOptionList = this.getMealOptionList.bind(this);
  }

  // gets menu data as soon as page renders
  componentDidMount() {
    this.getMenuData(() => {
      const { menu } = this.state;
      const mealOptions = Object.keys(menu[0]);
      const meal0 = { [mealOptions[0]]: true };
      const memo = mealOptions.map((meal) => ({ [meal]: false }));
      memo[0] = meal0;
      console.log('this is state: ', this.state)
      this.setState({ menuView: memo });
    });
  }

  // get menu data from server
  getMenuData(cb = null) {
    const id = window.location.pathname.split('/')[1].slice(1);
    $.get(`http://localhost:3004/api/${id === undefined ? '1' : id}/menu`, (result) => {
      this.setState({ menu: result }, () => cb());
    });
  }

  getMealOptionList() {
    const { menu } = this.state;
    return Object.keys(menu[0]);
  }

  // handles button click changing states
  handleViewChange(mealOption) {
    this.setState({ selectedMealOption: mealOption });
  }

  // handles rendering the bottom half of the menu
  handleVisibility() {
    const { fullMenuIsVisible } = this.state;
    if (fullMenuIsVisible === true) {
      this.setState({ fullMenuIsVisible: false });
    } else {
      this.setState({ fullMenuIsVisible: true });
    }
  }


  render() {
    const { menu, menuView, fullMenuIsVisible, selectedMealOption } = this.state;
    const meals = Object.entries(menu[0]);
    const mealOptions = this.getMealOptionList();
    // handles conditional rendering
    let mealTime;
    let mealTime2 = [];
    menuView.forEach((meal) => {
      const mealKey = Object.keys(meal);
      if (meal[mealKey[0]] === true) {
        const categories = Object.entries(menu[0][mealKey[0]]);
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

        if (fullMenuIsVisible === true) {
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
        <div className={styles.jrContainer}>
          <hr />
          <div className={styles.mealOptions}>
            { mealOptions.map((mealOption) => {
              return <MealOption selected={selectedMealOption === mealOption} changeMeal={this.handleViewChange} mealOption={mealOption} />;
            })
            }
          </div>
          <hr />
        </div>
        <div className={fullMenuIsVisible ? styles.meals2 : styles.meals}>
          {mealTime}
          {mealTime2}
        </div>
        <div className={styles.hideButton}>
          <HideButton handleVisibility={this.handleVisibility} fullMenuIsVisible={fullMenuIsVisible} />
        </div>
      </div>
    );
  }
}

window.menu = Menu;
export default Menu;
