import React from 'react';
import $ from 'jquery';
import MealOption from './MealOption';
import Category from './Category';
import sample from '../database/sampleData';
import HideButton from './HideButton';

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
  // componentDidMount() {
  //   this.getMenuData(() => {
  //     const { menuData } = this.state;
  //     const mealOptions = Object.keys(menuData[0]);
  //     const meal0 = { [mealOptions[0]]: true };
  //     const memo = mealOptions.map((meal) => ({ [meal]: false }));
  //     memo[0] = meal0;
  //     this.setState({ menuView: memo });
  //   });
  // }

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
      console.log('mealKey', mealKey);
      if (meal[mealKey[0]] === true) {
        console.log(menuData[0][mealKey[0]]);
        const categories = Object.entries(menuData[0][mealKey[0]]);
        const categories1 = categories.slice(0, 2);
        const categories2 = categories.slice(2, categories.length);

        mealTime = categories1.map((category) => {
          const dishes = Object.entries(category[1]);
          return (
            <div>
              <Category category={category[0]} dishes={dishes} />
              <br />
            </div>
          );
        });

        if (visibility[1] === true) {
          mealTime2 = categories2.map((category) => {
            const dishes = Object.entries(category[1]);
            return (
              <div>
                <Category category={category[0]} dishes={dishes} />
                <br />
              </div>
            );
          });
        }
      }
    });

    return (
      <div>
        {meals.map(
          (meal) => <MealOption changeMeal={this.handleViewChange} menuOption={meal[0]} />,
        )}
        {mealTime}
        {mealTime2}
        <HideButton handleVisibility={this.handleVisibility} visibility={visibility[0]} />
      </div>
    );
  }
}

export default App;
