import React from 'react';
import styles from './css_modules/mealOption.css';

class MealOption extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggled: false,
    };
    this.handleSelected = this.handleSelected.bind(this);
  }

  // handles color change when selected
  handleSelected(cb) {
    const { toggled } = this.state;
    this.setState({ toggled: !toggled }, () => cb());
  }

  render() {
    const { mealOption, changeMeal, selected } = this.props;
    const { toggled } = this.state;
    let select;
    if (!selected) {
      select = <button type="button" className={styles.unselected} onClick={() => changeMeal(mealOption)}>{ mealOption }</button>;
    } else {
      select = <button type="button" className={styles.selected} onClick={() => changeMeal(mealOption)}>{ mealOption }</button>;
    }
    return (
      <div>
        { select }
      </div>
    );
  }
};

export default MealOption;
