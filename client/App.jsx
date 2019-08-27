import React from 'react';
import $ from 'jquery';
import MealOption from './MealOption';
import Category from './Category';
import sample from '../database/sampleData';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuData: sample,
      menuView: {},
    };
    this.getMenuData = this.getMenuData.bind(this);
  }

  // gets menu data as soon as page renders
  componentDidMount() {
    this.getMenuData();
  }

  // get menu data from server
  getMenuData() {
    $.get('/api/L7/menu', (result) => {
      this.setState({ menuData: result });
    });
  }


  render() {
    const { menuData } = this.state;
    const meals = Object.entries(menuData[0]);
    return (
      <div>
        {meals.map((meal) => <MealOption menuOption={meal[0]} />)}
        {meals.map((meal) => {
          const categories = Object.entries(meal[1]);
          return categories.map((category) => {
            const dishes = Object.entries(category[1]);
            return <Category category={category[0]} dishes={dishes} />;
          });
        })}
      </div>
    );
  }
}

export default App;
