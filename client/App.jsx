import React from 'react';
import $ from 'jquery';
import MealOption from './MealOption';
import Category from './Category';
// import sample from '../database/sampleData';
import HideButton from './HideButton';
import styles from './css_modules/app.css';

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: undefined,
      selectedMealOption: undefined,
      fullMenuIsVisible: false,
      isLoading: true,
    };
    this.getMenuData = this.getMenuData.bind(this);
    this.handleViewChange = this.handleViewChange.bind(this);
    this.handleVisibility = this.handleVisibility.bind(this);
    this.getMealOptionList = this.getMealOptionList.bind(this);
  }

  // gets menu data as soon as page renders
  // eslint-disable-next-line camelcase
  componentDidMount() {
    this.getMenuData();
  }

  // get menu data from server
  getMenuData() {
    const id = window.location.pathname.split('/')[1].slice(1);
    $.get(`http://ec2-18-219-139-83.us-east-2.compute.amazonaws.com:3004/api/${id === undefined ? '1' : id}/menu`, (result) => {
      const selectedMealOption = this.getMealOptionList(result[0])[0];
      this.setState({ menu: result[0], selectedMealOption, isLoading: false });
    });
  }

  // eslint-disable-next-line react/destructuring-assignment
  getMealOptionList(inputMenu = this.state.menu) {
    return Object.keys(inputMenu);
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
    const {
      menu, fullMenuIsVisible, selectedMealOption, isLoading,
    } = this.state;
    const mealOptions = isLoading ? undefined : this.getMealOptionList();
    const categories = isLoading ? undefined : menu[selectedMealOption];
    const fetchedMenu = isLoading ? <div /> : (
      <div className={styles.masterContainer}>
        <h1>Menu</h1>
        <div className={styles.jrContainer}>
          <hr />
          <div className={styles.mealOptions}>
            {
          mealOptions.map((mealOption) => (
            <MealOption
              selected={selectedMealOption === mealOption}
              changeMeal={this.handleViewChange}
              mealOption={mealOption}
            />
          ))
        }
          </div>
          <hr />
        </div>
        <div className={fullMenuIsVisible ? styles.meals2 : styles.meals}>
          {Object.keys(categories).map((categoryName) => {
            const dishes = categories[categoryName];
            return (
              <div>
                <Category categoryName={categoryName} dishes={dishes} />
                <hr />
              </div>
            );
          })}
        </div>
        <div className={styles.hideButton}>
          <HideButton
            handleVisibility={this.handleVisibility}
            fullMenuIsVisible={fullMenuIsVisible}
          />
        </div>
      </div>
    );
    return (
      <div>
        { fetchedMenu }
      </div>
    );
  }
}

window.menu = Menu;
export default Menu;
