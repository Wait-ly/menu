import React from 'react';
import $ from 'jquery';
import MealOption from './MealOption';
import Category from './Category';
import sample from '../database/sampleData';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuData: sample, // array
      menuView: [{ Brunch: true }, { Dinner: false }],
    };
    this.getMenuData = this.getMenuData.bind(this);
    this.handleViewChange = this.handleViewChange.bind(this);
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
    $.get('/api/L7/menu', (result) => {
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

  render() {
    const { menuData, menuView } = this.state;
    const meals = Object.entries(menuData[0]);
    // handles conditional rendering
    let mealTime;
    menuView.forEach((meal) => {
      const mealKey = Object.keys(meal);
      if (meal[mealKey[0]] === true) {
        const categories = Object.entries(menuData[0][mealKey[0]]);
        mealTime = categories.map((category) => {
          const dishes = Object.entries(category[1]);
          return (
            <div>
              <Category category={category[0]} dishes={dishes} />
              <br />
            </div>
          );
        });
      }
    });

    return (
      <div>
        {meals.map(
          (meal) => <MealOption changeMeal={this.handleViewChange} menuOption={meal[0]} />
        )}
        {mealTime}
      </div>
    );
  }
}

export default App;
